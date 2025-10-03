from django.db import models
from django.contrib.auth.models import User


class CashTransaction(models.Model):
    TYPE_CHOICES = (
        ("income", "Income"),
        ("expense", "Expense"),
    )

    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    type = models.CharField(max_length=7, choices=TYPE_CHOICES)
    source_or_destination = models.CharField(max_length=255, help_text="Where the money came from or went to")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.created_at:%Y-%m-%d %H:%M} {self.type} {self.amount} - {self.description}"


class Person(models.Model):
    """Store people and their UPI IDs for bill splitting"""
    name = models.CharField(max_length=100)
    upi_id = models.CharField(max_length=100, help_text="UPI ID for payments")
    phone = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.upi_id})"


class BillSplit(models.Model):
    """Main bill splitting record"""
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    split_type = models.CharField(
        max_length=20,
        choices=[
            ('equal', 'Equal Split'),
            ('custom', 'Custom Amounts'),
        ],
        default='equal'
    )
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_settled = models.BooleanField(default=False)
    settled_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - ${self.total_amount}"

    @property
    def split_count(self):
        return self.billsplititem_set.count()

    @property
    def remaining_amount(self):
        paid_amount = sum(item.amount for item in self.billsplititem_set.filter(is_paid=True))
        return self.total_amount - paid_amount


class BillSplitItem(models.Model):
    """Individual person's share in a bill split"""
    bill_split = models.ForeignKey(BillSplit, on_delete=models.CASCADE)
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    is_paid = models.BooleanField(default=False)
    paid_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['bill_split', 'person']
        ordering = ['person__name']

    def __str__(self):
        return f"{self.person.name} - ${self.amount} ({'Paid' if self.is_paid else 'Pending'})"


class BillSplitHistory(models.Model):
    """Track changes to bill splits"""
    bill_split = models.ForeignKey(BillSplit, on_delete=models.CASCADE)
    action = models.CharField(
        max_length=50,
        choices=[
            ('created', 'Bill Created'),
            ('person_added', 'Person Added'),
            ('person_removed', 'Person Removed'),
            ('amount_changed', 'Amount Changed'),
            ('paid', 'Payment Made'),
            ('settled', 'Bill Settled'),
        ]
    )
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.bill_split.title} - {self.action}"



