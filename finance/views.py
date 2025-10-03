from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from decimal import Decimal
import json
from .models import CashTransaction, BillSplit, BillSplitItem, Person, BillSplitHistory


def cash_list_create(request):
    if request.method == 'POST':
        description = request.POST.get('cash_desc', '').strip()
        amount_raw = request.POST.get('cash_amount', '0').strip()
        type_value = request.POST.get('cash_type', 'expense').strip()
        source_or_destination = request.POST.get('cash_source', '').strip()

        try:
            amount = float(amount_raw)
        except ValueError:
            amount = 0

        if description and type_value in ('income', 'expense'):
            CashTransaction.objects.create(
                description=description,
                amount=amount,
                type=type_value,
                source_or_destination=source_or_destination or 'Unknown',
            )
        return redirect(reverse('cash'))

    transactions = CashTransaction.objects.all()
    income_list = [t for t in transactions if t.type == 'income']
    expense_list = [t for t in transactions if t.type == 'expense']

    total_income = sum(t.amount for t in income_list)
    total_expense = sum(t.amount for t in expense_list)
    total_balance = total_income - total_expense

    context = {
        'income_transactions': income_list,
        'expense_transactions': expense_list,
        'total_income': total_income,
        'total_expense': total_expense,
        'total_balance': total_balance,
    }
    return render(request, 'cash.html', context)


def cash_edit(request, pk: int):
    tx = get_object_or_404(CashTransaction, pk=pk)
    if request.method == 'POST':
        tx.description = request.POST.get('cash_desc', tx.description).strip()
        amount_raw = request.POST.get('cash_amount', str(tx.amount)).strip()
        tx.type = request.POST.get('cash_type', tx.type).strip()
        tx.source_or_destination = request.POST.get('cash_source', tx.source_or_destination).strip()
        try:
            tx.amount = float(amount_raw)
        except ValueError:
            pass
        tx.save()
        return redirect(reverse('cash'))

    return render(request, 'cash_edit.html', {'t': tx})


def cash_delete(request, pk: int):
    tx = get_object_or_404(CashTransaction, pk=pk)
    if request.method == 'POST':
        tx.delete()
        return redirect(reverse('cash'))
    return render(request, 'cash_delete_confirm.html', {'t': tx})


def bill_split_home(request):
    """Main bill splitting page"""
    recent_transactions = CashTransaction.objects.filter(type='expense').order_by('-created_at')[:10]
    recent_bills = BillSplit.objects.all().order_by('-created_at')[:5]
    people = Person.objects.all().order_by('name')
    
    context = {
        'recent_transactions': recent_transactions,
        'recent_bills': recent_bills,
        'people': people,
    }
    return render(request, 'bill_split.html', context)


def create_bill_split(request):
    """Create a new bill split"""
    if request.method == 'POST':
        title = request.POST.get('title', '').strip()
        description = request.POST.get('description', '').strip()
        total_amount = request.POST.get('total_amount', '0').strip()
        split_type = request.POST.get('split_type', 'equal')
        person_ids = request.POST.getlist('people')
        custom_amounts = request.POST.getlist('custom_amounts')
        
        try:
            total_amount = Decimal(total_amount)
        except (ValueError, TypeError):
            messages.error(request, 'Invalid total amount')
            return redirect('bill_split_home')
        
        if not title or not person_ids:
            messages.error(request, 'Title and at least one person are required')
            return redirect('bill_split_home')
        
        # Create bill split
        bill_split = BillSplit.objects.create(
            title=title,
            description=description,
            total_amount=total_amount,
            split_type=split_type
        )
        
        # Create split items
        if split_type == 'equal':
            amount_per_person = total_amount / len(person_ids)
            for person_id in person_ids:
                person = get_object_or_404(Person, pk=person_id)
                BillSplitItem.objects.create(
                    bill_split=bill_split,
                    person=person,
                    amount=amount_per_person
                )
        else:  # custom amounts
            for i, person_id in enumerate(person_ids):
                person = get_object_or_404(Person, pk=person_id)
                try:
                    amount = Decimal(custom_amounts[i]) if i < len(custom_amounts) else Decimal('0')
                except (ValueError, TypeError):
                    amount = Decimal('0')
                BillSplitItem.objects.create(
                    bill_split=bill_split,
                    person=person,
                    amount=amount
                )
        
        # Create history entry
        BillSplitHistory.objects.create(
            bill_split=bill_split,
            action='created',
            description=f'Bill "{title}" created with {len(person_ids)} people, total ${total_amount}'
        )
        
        messages.success(request, f'Bill split "{title}" created successfully!')
        return redirect('bill_split_detail', pk=bill_split.pk)
    
    return redirect('bill_split_home')


def create_bill_from_transaction(request, tx_pk):
    """Create bill split from existing transaction"""
    transaction = get_object_or_404(CashTransaction, pk=tx_pk)
    people = Person.objects.all().order_by('name')
    
    if request.method == 'POST':
        person_ids = request.POST.getlist('people')
        split_type = request.POST.get('split_type', 'equal')
        custom_amounts = request.POST.getlist('custom_amounts')
        
        if not person_ids:
            messages.error(request, 'At least one person is required')
            return redirect('bill_split_home')
        
        # Create bill split
        bill_split = BillSplit.objects.create(
            title=f"Split: {transaction.description}",
            description=f"Created from transaction: {transaction.description}",
            total_amount=abs(transaction.amount),
            split_type=split_type
        )
        
        # Create split items
        if split_type == 'equal':
            amount_per_person = abs(transaction.amount) / len(person_ids)
            for person_id in person_ids:
                person = get_object_or_404(Person, pk=person_id)
                BillSplitItem.objects.create(
                    bill_split=bill_split,
                    person=person,
                    amount=amount_per_person
                )
        else:  # custom amounts
            for i, person_id in enumerate(person_ids):
                person = get_object_or_404(Person, pk=person_id)
                try:
                    amount = Decimal(custom_amounts[i]) if i < len(custom_amounts) else Decimal('0')
                except (ValueError, TypeError):
                    amount = Decimal('0')
                BillSplitItem.objects.create(
                    bill_split=bill_split,
                    person=person,
                    amount=amount
                )
        
        # Create history entry
        BillSplitHistory.objects.create(
            bill_split=bill_split,
            action='created',
            description=f'Bill created from transaction "{transaction.description}" with {len(person_ids)} people'
        )
        
        messages.success(request, f'Bill split created from transaction!')
        return redirect('bill_split_detail', pk=bill_split.pk)
    
    context = {
        'transaction': transaction,
        'people': people,
    }
    return render(request, 'create_bill_from_transaction.html', context)


def bill_split_detail(request, pk):
    """View bill split details"""
    bill_split = get_object_or_404(BillSplit, pk=pk)
    split_items = bill_split.billsplititem_set.all()
    history = bill_split.billsplithistory_set.all()
    
    context = {
        'bill_split': bill_split,
        'split_items': split_items,
        'history': history,
    }
    return render(request, 'bill_split_detail.html', context)


@csrf_exempt
def mark_payment(request, pk):
    """Mark a split item as paid/unpaid"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            item = get_object_or_404(BillSplitItem, pk=pk)
            is_paid = data.get('is_paid', False)
            
            item.is_paid = is_paid
            if is_paid:
                item.paid_at = timezone.now()
            else:
                item.paid_at = None
            item.save()
            
            # Create history entry
            action = 'paid' if is_paid else 'unpaid'
            BillSplitHistory.objects.create(
                bill_split=item.bill_split,
                action='paid' if is_paid else 'amount_changed',
                description=f'{item.person.name} marked as {"paid" if is_paid else "unpaid"} - ${item.amount}'
            )
            
            return JsonResponse({'success': True, 'is_paid': is_paid})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    
    return JsonResponse({'success': False, 'error': 'Invalid request'})


def add_person(request):
    """Add a new person"""
    if request.method == 'POST':
        name = request.POST.get('name', '').strip()
        upi_id = request.POST.get('upi_id', '').strip()
        phone = request.POST.get('phone', '').strip()
        email = request.POST.get('email', '').strip()
        
        if not name or not upi_id:
            messages.error(request, 'Name and UPI ID are required')
            return redirect('bill_split_home')
        
        person = Person.objects.create(
            name=name,
            upi_id=upi_id,
            phone=phone if phone else None,
            email=email if email else None
        )
        
        messages.success(request, f'Person "{name}" added successfully!')
        return redirect('bill_split_home')
    
    return redirect('bill_split_home')



