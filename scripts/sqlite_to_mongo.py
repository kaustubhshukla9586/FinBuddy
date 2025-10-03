#!/usr/bin/env python3
"""
Simple migration script: copy rows from SQLite (db.sqlite3) into MongoDB Atlas collections
using the configuration at static/config/mongo_transfer.json.

This script is intentionally conservative: it reads tables and inserts documents without
deleting existing data. It supports exporting to JSON files (optional) and importing
from JSON files if configured.

Run from project root (where manage.py lives):
  python scripts\sqlite_to_mongo.py

"""
import json
import os
import sqlite3
from datetime import datetime

from pymongo import MongoClient


ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG_PATH = os.path.join(ROOT, 'static', 'config', 'mongo_transfer.json')
SQLITE_DB = os.path.join(ROOT, 'db.sqlite3')


def load_config():
    with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)


def sqlite_rows(table_name):
    conn = sqlite3.connect(SQLITE_DB)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM {table_name}")
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return rows


def convert_row_types(row):
    # Convert sqlite types to JSON-friendly types (e.g., bytes, datetime strings)
    out = {}
    for k, v in row.items():
        if isinstance(v, bytes):
            try:
                out[k] = v.decode('utf-8')
            except Exception:
                out[k] = v.hex()
        else:
            out[k] = v
    return out


def main():
    cfg = load_config()
    atlas_uri = cfg['mongodb'].get('atlas_uri') or os.environ.get(cfg['mongodb'].get('atlas_uri_env'))
    if not atlas_uri:
        raise SystemExit('MongoDB Atlas URI not found in config or environment')

    db_name = cfg['mongodb'].get('database')
    client = MongoClient(atlas_uri)
    db = client[db_name]

    # Ensure exports/imports directories exist
    exports_dir = os.path.join(ROOT, 'exports')
    os.makedirs(exports_dir, exist_ok=True)

    # Map simple tables to configured collections
    coll_map = cfg['mongodb'].get('collections', {})

    # Basic mapping: check for tables corresponding to collections
    summary = {}
    for table, coll_name in coll_map.items():
        # Guess the sqlite table name from Django model names used in this project
        # Known tables: finance_cashtransaction, finance_person, finance_billsplit, finance_billsplititem, finance_billsplithistory
        # But config expects 'expenses' and 'incomes' - we'll attempt to read those tables first
        sqlite_table_candidates = [table]

        # additionally try common Django table names
        possible = [
            'finance_cashtransaction',
            'finance_person',
            'finance_billsplit',
            'finance_billsplititem',
            'finance_billsplithistory',
            'expenses',
            'incomes'
        ]
        sqlite_table_candidates.extend([p for p in possible if p not in sqlite_table_candidates])

        rows = []
        found_table = None
        for t in sqlite_table_candidates:
            try:
                rows = sqlite_rows(t)
                found_table = t
                break
            except Exception:
                continue

        if found_table is None:
            print(f"No sqlite table found for target collection '{coll_name}' (tried candidates)")
            summary[coll_name] = {'imported': 0, 'note': 'no table found'}
            continue

        docs = [convert_row_types(r) for r in rows]
        if docs:
            # Remove sqlite's implicit id column name 'id' if present: keep as-is, Mongo will create _id
            for d in docs:
                if 'id' in d and '_id' not in d:
                    # keep id as a field, but also allow Mongo to generate its own _id
                    pass

            res = db[coll_name].insert_many(docs)
            print(f"Inserted {len(res.inserted_ids)} documents into '{db_name}.{coll_name}' from table '{found_table}'")
            summary[coll_name] = {'imported': len(res.inserted_ids), 'table': found_table}
        else:
            print(f"No rows found in sqlite table '{found_table}' for collection '{coll_name}'")
            summary[coll_name] = {'imported': 0, 'table': found_table}

        # Optionally write an export JSON
        export_cfgs = cfg.get('export', {}).get('collections', [])
        for e in export_cfgs:
            if e.get('name') == table:
                out_file = os.path.join(ROOT, e.get('output_file'))
                os.makedirs(os.path.dirname(out_file), exist_ok=True)
                with open(out_file, 'w', encoding='utf-8') as f:
                    json.dump(docs, f, default=str, indent=2)
                print(f"Wrote export JSON to {out_file}")

    # handle bill_split collections (if present)
    bs_map = cfg['mongodb'].get('bill_split_collections', {})
    if bs_map:
        # Map Django bill split tables
        django_map = {
            'users': 'finance_person',
            'bills': 'finance_billsplit',
            'bill_items': 'finance_billsplititem',
            'transactions': 'finance_cashtransaction',
            'history': 'finance_billsplithistory'
        }
        for coll, sqlite_table in django_map.items():
            coll_name = bs_map.get(coll) or coll
            try:
                rows = sqlite_rows(sqlite_table)
            except Exception:
                print(f"No sqlite table '{sqlite_table}' for bill-split collection '{coll_name}'")
                summary[coll_name] = {'imported': 0, 'note': 'no table found'}
                continue

            docs = [convert_row_types(r) for r in rows]
            if docs:
                res = db[coll_name].insert_many(docs)
                print(f"Inserted {len(res.inserted_ids)} documents into '{db_name}.{coll_name}' from table '{sqlite_table}'")
                summary[coll_name] = {'imported': len(res.inserted_ids), 'table': sqlite_table}
            else:
                print(f"No rows to import for '{sqlite_table}'")
                summary[coll_name] = {'imported': 0, 'table': sqlite_table}

    # Summary
    print('\nMigration summary:')
    for k, v in summary.items():
        print(f" - {k}: {v}")


if __name__ == '__main__':
    main()
