from django.contrib import admin
from .models import CashTransaction


@admin.register(CashTransaction)
class CashTransactionAdmin(admin.ModelAdmin):
    list_display = ("created_at", "description", "amount", "type", "source_or_destination")
    list_filter = ("type", "created_at")
    search_fields = ("description", "source_or_destination")



