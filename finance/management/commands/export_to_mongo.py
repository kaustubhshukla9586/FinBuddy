import json
import os
from decimal import Decimal
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError

from finance.models import CashTransaction


class Command(BaseCommand):
    help = "Export CashTransaction data to MongoDB Atlas as expenses/incomes collections"

    def add_arguments(self, parser):
        parser.add_argument('--config', type=str, default='static/config/mongo_transfer.json', help='Path to mongo transfer config JSON')
        parser.add_argument('--batch', type=int, default=500, help='Batch size for inserts')
        parser.add_argument('--uri', type=str, default=None, help='Override MongoDB Atlas connection URI (takes precedence over config/env)')

    def handle(self, *args, **options):
        config_path = Path(options['config'])
        if not config_path.exists():
            raise CommandError(f"Config file not found: {config_path}")

        try:
            with config_path.open('r', encoding='utf-8') as f:
                cfg = json.load(f)
        except Exception as e:
            raise CommandError(f"Failed to read config: {e}")

        mongodb_cfg = cfg.get('mongodb') or {}
        # Resolve URI: CLI --uri > env via atlas_uri_env > atlas_uri in config
        atlas_uri = options.get('uri')
        if not atlas_uri:
            atlas_uri_env = mongodb_cfg.get('atlas_uri_env')
            if atlas_uri_env:
                atlas_uri = os.getenv(atlas_uri_env)
        if not atlas_uri:
            atlas_uri = mongodb_cfg.get('atlas_uri')
        db_name = mongodb_cfg.get('database', 'finance_tracker')
        col_expenses = (mongodb_cfg.get('collections') or {}).get('expenses', 'expenses')
        col_incomes = (mongodb_cfg.get('collections') or {}).get('incomes', 'incomes')

        if not atlas_uri or '<username>' in atlas_uri or '<cluster>' in atlas_uri:
            raise CommandError('Invalid MongoDB Atlas URI. Set a valid URI in config.mongodb.atlas_uri or provide environment variable via config.mongodb.atlas_uri_env.')

        try:
            from pymongo import MongoClient
        except Exception as e:
            raise CommandError('pymongo is not installed. Please install it in your environment.')

        client = MongoClient(atlas_uri)
        db = client[db_name]
        expenses = db[col_expenses]
        incomes = db[col_incomes]

        def to_number(value):
            if isinstance(value, Decimal):
                return float(value)
            return float(value)

        docs_expense = []
        docs_income = []
        for tx in CashTransaction.objects.all().iterator():
            doc = {
                'date': tx.created_at.strftime('%Y-%m-%d'),
                'description': tx.description,
                'amount': to_number(tx.amount if tx.type == 'expense' else -tx.amount) * -1 if tx.type == 'expense' else to_number(tx.amount),
                'category': None,
                'method': 'cash',
                'source': tx.source_or_destination if tx.type == 'income' else None,
                'type': tx.type,
            }
            if tx.type == 'expense':
                docs_expense.append({k: v for k, v in doc.items() if k not in ('source',)})
            else:
                docs_income.append({k: v for k, v in doc.items() if k not in ('category',)})

        # Bulk insert in batches
        def bulk_insert(collection, docs, batch_size):
            if not docs:
                return 0
            inserted = 0
            for i in range(0, len(docs), batch_size):
                chunk = docs[i:i+batch_size]
                if not chunk:
                    continue
                res = collection.insert_many(chunk)
                inserted += len(res.inserted_ids)
            return inserted

        ins_exp = bulk_insert(expenses, docs_expense, options['batch'])
        ins_inc = bulk_insert(incomes, docs_income, options['batch'])

        self.stdout.write(self.style.SUCCESS(f"Exported {ins_exp} expenses and {ins_inc} incomes to MongoDB '{db_name}'."))


