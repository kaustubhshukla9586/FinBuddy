from django.shortcuts import render
from finance.models import CashTransaction


def landing(request):
    # Get real cash transactions from database
    cash_transactions = CashTransaction.objects.all()
    
    # Calculate totals
    cash_income = sum(t.amount for t in cash_transactions if t.type == 'income')
    cash_expense = sum(t.amount for t in cash_transactions if t.type == 'expense')
    
    # Mock online transactions for demo (you can replace with real data later)
    online_income = 1800
    online_expense = 950
    
    # Total calculations
    total_income = cash_income + online_income
    total_expense = cash_expense + online_expense
    
    # Chart data for cash vs online
    chart_labels = ['Cash Income', 'Cash Expense', 'Online Income', 'Online Expense']
    chart_data = [cash_income, cash_expense, online_income, online_expense]
    
    # Recent transactions (mix of cash and online)
    recent_transactions = []
    for t in cash_transactions[:3]:  # Last 3 cash transactions
        recent_transactions.append({
            "date": t.created_at.strftime("%Y-%m-%d"),
            "description": f"[Cash] {t.description}",
            "amount": t.amount,
            "type": t.type
        })
    
    # Add some mock online transactions
    online_transactions = [
        {"date": "2025-10-15", "description": "[Online] Salary Deposit", "amount": 1800, "type": "income"},
        {"date": "2025-10-14", "description": "[Online] Rent Payment", "amount": -800, "type": "expense"},
        {"date": "2025-10-13", "description": "[Online] Grocery Shopping", "amount": -150, "type": "expense"},
    ]
    recent_transactions = recent_transactions + online_transactions[:3-len(recent_transactions)]
    
    context = {
        'chart_labels': chart_labels,
        'chart_data': chart_data,
        'income_total': total_income,
        'expense_total': total_expense,
        'transactions': recent_transactions,
        'cash_income': cash_income,
        'cash_expense': cash_expense,
        'online_income': online_income,
        'online_expense': online_expense,
    }
    return render(request, 'landing.html', context)


def all_transactions(request):
    # Reuse or fetch transactions; using stub data for now
    transactions = [
        {"date": "2025-10-01", "description": "Salary", "amount": 2500, "type": "income"},
        {"date": "2025-10-02", "description": "Rent", "amount": -800, "type": "expense"},
        {"date": "2025-10-03", "description": "Groceries", "amount": -120, "type": "expense"},
        {"date": "2025-09-28", "description": "Dining", "amount": -45.5, "type": "expense"},
        {"date": "2025-09-25", "description": "Freelance", "amount": 400, "type": "income"},
    ]

    sort_order = request.GET.get('sort', 'desc')  # 'asc' or 'desc'
    reverse = (sort_order != 'asc')
    transactions_sorted = sorted(transactions, key=lambda t: t["date"], reverse=reverse)

    return render(request, 'transactions.html', {
        'transactions': transactions_sorted,
        'sort': sort_order,
    })


def ai_agent(request):
    # Get real cash transactions from database
    cash_transactions = CashTransaction.objects.all()
    
    # Calculate totals
    cash_income = sum(t.amount for t in cash_transactions if t.type == 'income')
    cash_expense = sum(t.amount for t in cash_transactions if t.type == 'expense')
    
    # Mock online transactions for demo
    online_income = 1800
    online_expense = 950
    
    # Total calculations
    total_income = cash_income + online_income
    total_expense = cash_expense + online_expense
    
    # Recent transactions (mix of cash and online)
    recent_transactions = []
    for t in cash_transactions[:3]:  # Last 3 cash transactions
        recent_transactions.append({
            "date": t.created_at.strftime("%Y-%m-%d"),
            "description": f"[Cash] {t.description}",
            "amount": t.amount,
            "type": t.type
        })
    
    # Add some mock online transactions
    online_transactions = [
        {"date": "2025-10-15", "description": "[Online] Salary Deposit", "amount": 1800, "type": "income"},
        {"date": "2025-10-14", "description": "[Online] Rent Payment", "amount": -800, "type": "expense"},
        {"date": "2025-10-13", "description": "[Online] Grocery Shopping", "amount": -150, "type": "expense"},
    ]
    recent_transactions = recent_transactions + online_transactions[:3-len(recent_transactions)]
    
    context = {
        'transactions': recent_transactions,
        'cash_income': cash_income,
        'cash_expense': cash_expense,
        'online_income': online_income,
        'online_expense': online_expense,
        'income_total': total_income,
        'expense_total': total_expense,
    }
    return render(request, 'ai_agent.html', context)

