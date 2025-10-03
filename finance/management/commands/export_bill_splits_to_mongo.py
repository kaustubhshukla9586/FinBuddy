import json
from decimal import Decimal
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError

from finance.models import BillSplit, BillSplitItem, Person, BillSplitHistory
from finance import mongo_sync


class Command(BaseCommand):
    help = "Export Bill Split data to separate MongoDB Atlas database"

    def add_arguments(self, parser):
        parser.add_argument('--config', type=str, default='static/config/mongo_transfer.json', help='Path to mongo transfer config JSON')
        parser.add_argument('--batch', type=int, default=100, help='Batch size for operations')
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
                import os
                atlas_uri = os.getenv(atlas_uri_env)
        if not atlas_uri:
            atlas_uri = mongodb_cfg.get('atlas_uri')
        
        bill_split_db_name = mongodb_cfg.get('bill_split_database', 'bill_split_db')

        if not atlas_uri or '<username>' in atlas_uri or '<cluster>' in atlas_uri:
            raise CommandError('Invalid MongoDB Atlas URI. Set a valid URI in config.mongodb.atlas_uri or provide environment variable via config.mongodb.atlas_uri_env.')

        try:
            from pymongo import MongoClient
        except Exception as e:
            raise CommandError('pymongo is not installed. Please install it in your environment.')

        client = MongoClient(atlas_uri)
        bill_split_db = client[bill_split_db_name]
        
        # Get collections
        users = bill_split_db['users']
        bills = bill_split_db['bills']
        bill_items = bill_split_db['bill_items']
        transactions = bill_split_db['transactions']
        history = bill_split_db['history']

        # Export People
        people_docs = []
        for person in Person.objects.all():
            doc = {
                'user_id': f'user_{person.pk}',
                'django_id': person.pk,
                'name': person.name,
                'upi_id': person.upi_id,
                'phone': person.phone,
                'email': person.email,
                'created_at': person.created_at.isoformat(),
                'updated_at': person.updated_at.isoformat(),
            }
            people_docs.append(doc)

        # Export Bills
        bills_docs = []
        for bill in BillSplit.objects.all():
            doc = {
                'bill_id': f'bill_{bill.pk}',
                'django_id': bill.pk,
                'title': bill.title,
                'description': bill.description,
                'total_amount': float(bill.total_amount),
                'split_type': bill.split_type,
                'is_settled': bill.is_settled,
                'created_at': bill.created_at.isoformat(),
                'updated_at': bill.updated_at.isoformat(),
                'settled_at': bill.settled_at.isoformat() if bill.settled_at else None,
            }
            bills_docs.append(doc)

        # Export Bill Items
        bill_items_docs = []
        for item in BillSplitItem.objects.all():
            doc = {
                'item_id': f'item_{item.pk}',
                'django_id': item.pk,
                'bill_id': f'bill_{item.bill_split.pk}',
                'user_id': f'user_{item.person.pk}',
                'amount': float(item.amount),
                'is_paid': item.is_paid,
                'paid_at': item.paid_at.isoformat() if item.paid_at else None,
                'notes': item.notes,
                'created_at': item.created_at.isoformat(),
            }
            bill_items_docs.append(doc)

        # Export History
        history_docs = []
        for hist in BillSplitHistory.objects.all():
            doc = {
                'history_id': f'hist_{hist.pk}',
                'django_id': hist.pk,
                'bill_id': f'bill_{hist.bill_split.pk}',
                'action': hist.action,
                'description': hist.description,
                'created_at': hist.created_at.isoformat(),
            }
            history_docs.append(doc)

        # Export Transactions (create from paid items)
        transaction_docs = []
        for item in BillSplitItem.objects.filter(is_paid=True, paid_at__isnull=False):
            doc = {
                'transaction_id': f'txn_{item.pk}_{int(item.paid_at.timestamp())}',
                'user_id': f'user_{item.person.pk}',
                'bill_id': f'bill_{item.bill_split.pk}',
                'amount': float(item.amount),
                'type': 'payment',
                'status': 'completed',
                'created_at': item.paid_at.isoformat(),
            }
            transaction_docs.append(doc)

        # Bulk insert in batches
        def bulk_insert(collection, docs, batch_size):
            if not docs:
                return 0
            inserted = 0
            for i in range(0, len(docs), batch_size):
                chunk = docs[i:i+batch_size]
                if not chunk:
                    continue
                # Use upsert to avoid duplicates
                for doc in chunk:
                    collection.update_one(
                        {'django_id': doc.get('django_id')}, 
                        {'$set': doc}, 
                        upsert=True
                    )
                    inserted += 1
            return inserted

        # Insert all data
        ins_people = bulk_insert(users, people_docs, options['batch'])
        ins_bills = bulk_insert(bills, bills_docs, options['batch'])
        ins_items = bulk_insert(bill_items, bill_items_docs, options['batch'])
        ins_history = bulk_insert(history, history_docs, options['batch'])
        ins_transactions = bulk_insert(transactions, transaction_docs, options['batch'])

        self.stdout.write(self.style.SUCCESS(
            f"Exported to MongoDB '{bill_split_db_name}':\n"
            f"- {ins_people} users\n"
            f"- {ins_bills} bills\n"
            f"- {ins_items} bill items\n"
            f"- {ins_history} history entries\n"
            f"- {ins_transactions} transactions"
        ))
