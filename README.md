# 🪙 FinBuddy – Your Smart Financial Buddy  

FinBuddy is an **AI-powered finance tracking and advisory platform** built with a focus on **privacy, security, and insights**.  
It provides a **graphical dashboard** of your expenses, runs **real-time transaction analysis**, and integrates a **local AI assistant** for financial guidance.  

---

## ✨ Features  

- 📊 **Graphical Dashboard**  
  - Clean and professional UI.  
  - Visualize expenses by category, merchant, and time.  

- 🤖 **AI-Integrated Models (Local)**  
  - All AI models run locally → your data stays safe.  
  - Smart insights into spending behavior.  

- ⚡ **Real-Time Data Analysis**  
  - Parse SMS/bank messages instantly.  
  - Categorize expenses and detect recurring subscriptions.  

- ☁️ **Hybrid Cloud Option** *(Optional)*  
  - Keep data local for privacy.  
  - Or opt for a **cloud-based dataset** to unlock advanced insights & personalized advice.  

- 👥 **Split Bill Feature (For Students)**  
  - Easily split shared expenses with friends.  

- 🔜 **Upcoming Features**  
  - **Plaid Sandbox Integration** – Demo accounts with simulated transactions.  
  - **AI Chatbot for Financial Advice** – Personalized assistant to answer financial queries.  

---

## 🛠️ Tech Stack  

- **Backend:** Django (Python)  
- **Frontend:** HTML, CSS, JS (Django Templates, Chart.js)  
- **Database:** MongoDB (Atlas Cloud)  
- **AI Models:** Local integration for privacy, extendable to cloud APIs  

---

## 🚀 Getting Started  

### 1. Clone the Repository  
```bash
git clone https://github.com/your-username/finbuddy.git
cd finbuddy
```

### 2. Create and activate a virtual environment  

**Linux / macOS**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

**Windows (PowerShell)**
```bash
py -3 -m venv .venv
.venv\Scripts\Activate.ps1
```

### 3. Install dependencies  
```bash
pip install -r requirements.txt
```

> If `requirements.txt` doesn’t exist yet, create it with:  
> ```
> Django>=4.2,<5.0
> ```

### 4. Run database migrations  
```bash
python manage.py migrate
```

### 5. Start the development server  
```bash
python manage.py runserver
```

App will be available at:  
```
http://127.0.0.1:8000/
```

---

## 📦 Dependencies
- Python 3.10+
- Django 4.2+
- pip (Python package manager)
- Virtual environment (`venv`)

---

## 📂 Notes
- Add your environment variables in a `.env` file (never commit it).  
- Use `sms.json` (provided) as sample SMS data for testing.  
- Sample frontend (Django templates) is included for demo purposes.  
- Your actual frontend can be deployed separately and connected via API.  

---

## 🤖 Machine Learning Model (Summary)

FinBuddy includes an experimental **ML model** that predicts potential savings and spending insights.  
It works on structured features like:

- **Income & Earnings** → Monthly income, frequency, average credit inflows.  
- **Spending Behavior** → Total spend, category ratios, discretionary vs essential, variability.  
- **Lifestyle Indicators** → Number of transactions, average size, subscriptions, impulse spends.  
- **Cash Flow Health** → EMI/debt, carry-forward balance, savings rate %.  
- **Temporal Patterns** → Weekday vs weekend spending, seasonal spikes, post-salary burn rate.  

🎯 **Target:** Estimate the **maximum possible saving** = Income – Baseline Essential Spend.  
This helps users understand how much they *could* save by reducing non-essential expenses.  
