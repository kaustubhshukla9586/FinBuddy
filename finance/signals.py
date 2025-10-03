from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from .models import CashTransaction, BillSplit, BillSplitItem, Person, BillSplitHistory
from . import mongo_sync


@receiver(post_save, sender=CashTransaction)
def sync_cash_tx_on_save(sender, instance: CashTransaction, created: bool, **kwargs):
    # Upsert document in MongoDB Atlas; silently skip if not configured
    try:
        mongo_sync.upsert_transaction(instance)
    except Exception:
        # Do not block request lifecycle on sync failures
        pass


@receiver(post_delete, sender=CashTransaction)
def sync_cash_tx_on_delete(sender, instance: CashTransaction, **kwargs):
    try:
        mongo_sync.delete_transaction(instance.pk)
    except Exception:
        pass


@receiver(post_save, sender=BillSplit)
def sync_bill_split_on_save(sender, instance: BillSplit, created: bool, **kwargs):
    try:
        mongo_sync.upsert_bill_split(instance)
    except Exception:
        pass


@receiver(post_save, sender=BillSplitItem)
def sync_bill_split_item_on_save(sender, instance: BillSplitItem, created: bool, **kwargs):
    try:
        mongo_sync.upsert_bill_split_item(instance)
        # Create transaction record if payment was made
        if instance.is_paid and instance.paid_at:
            mongo_sync.create_payment_transaction(instance, 'payment', 'completed')
    except Exception:
        pass


@receiver(post_save, sender=Person)
def sync_person_on_save(sender, instance: Person, created: bool, **kwargs):
    try:
        mongo_sync.upsert_person(instance)
    except Exception:
        pass


@receiver(post_save, sender=BillSplitHistory)
def sync_bill_split_history_on_save(sender, instance: BillSplitHistory, created: bool, **kwargs):
    try:
        mongo_sync.upsert_bill_split_history(instance)
    except Exception:
        pass


