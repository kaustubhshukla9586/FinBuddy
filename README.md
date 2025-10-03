# FinBuddy 💸

A minimal, sleek, professional **finance assistant** that parses SMS into expenses, shows insights, detects subscriptions, and even has a voice/chat assistant.  
Built with **Django + vanilla Python + HTML/CSS/JS**.  

> ⚡ This repo contains a **sample frontend** (hand-built for testing) and hooks for your **actual frontend** (to be deployed separately).

---

## 🚀 Features
- **SMS Parsing** → Extracts Amount, Merchant, Category, Date, Credit/Debit from SMS (mocked with `sms.json`).
- **Expense Dashboard** → Clean UI with transactions, charts, and category breakdowns.
- **AI Insight Banner** → Semi-dynamic financial tips (e.g., “Cut 2 Zomato orders to save ₹500”).
- **Subscription Detection** → Identifies recurring payments (Netflix, Gym, etc.).
- **Chat Assistant** → Simple finance Q&A (totals, breakdowns, trends, tips).
- **Light/Dark Mode Toggle** → Premium dashboard vibes.
- **Sample Frontend** → Django templates for demo.
- **Actual Frontend** → Built separately, deployable on Netlify/Vercel/etc.

---

## 📂 Project Structure
finbuddy/
├─ finbuddy/ # Django app
│ ├─ chatbot.py # FinanceChatbot logic
│ ├─ views.py # API endpoints
│ ├─ urls.py
│ ├─ templates/
│ │ ├─ landing.html
│ │ └─ dashboard.html # sample UI
│ ├─ static/
│ │ └─ js/chart.js
│ ├─ sms.json # mock SMS dataset
│ └─ ...
├─ core/ # Django project (settings, urls, wsgi/asgi)
├─ manage.py
├─ requirements.txt
├─ .env # environment variables (ignored)
├─ .gitignore
└─ .gitattributes

yaml
Copy code

---

## ⚙️ Setup Instructions

### 1. Clone the repo
```bash
git clone <your-repo-url>.git
cd <your-repo-folder>
2. Virtual environment + dependencies
bash
Copy code
# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate

# Windows
py -3 -m venv .venv
.venv\Scripts\Activate.ps1

# Install Django + deps
pip install -r requirements.txt
If requirements.txt doesn’t exist yet, create it with:

shell
Copy code
Django>=4.2,<5.0
3. Environment variables
Create a .env in repo root:

ini
Copy code
DJANGO_DEBUG=True
DJANGO_SECRET_KEY=please_change_me
DJANGO_ALLOWED_HOSTS=127.0.0.1,localhost
⚠️ Make sure .env is in .gitignore.

4. Django setup
bash
Copy code
python manage.py migrate
python manage.py runserver
Open → http://127.0.0.1:8000/

/ → Landing Page (sample info site)

/dashboard/ → Sample Dashboard

/chatbot/ → API endpoint

🖼️ Frontend Notes
Sample frontend → Included in this repo (landing + dashboard).

Actual frontend → Built separately (deploy via Netlify/Vercel). Point its API calls to this Django backend.

📊 Dashboard Features
Transaction list (Amount, Merchant, Category, Date, Credit/Debit).

Pie + Bar charts with Chart.js.

AI Insight banner at top.

Subscriptions tab (recurring expenses).

Search + filter + export CSV/PDF.

Light/Dark mode toggle.

Integrated chatbot assistant.

🤖 Chatbot API
Endpoint
bash
Copy code
POST /chatbot/
Request
json
Copy code
{ "message": "total spent last 30" }
Response
json
Copy code
{ "reply": "Total spent from 2025-09-03 to 2025-10-02: ₹2876.00" }
Example Queries
total spent last 7

category breakdown last 30

spent on food last 7

spent at 'Zomato' last 30

weekly trend

subscriptions

insight

help

📑 Demo Data
sms.json contains mock transactions:

json
Copy code
{
  "id": "t1",
  "date": "2025-10-02",
  "merchant": "Zomato",
  "amount": 449,
  "category": "Food",
  "type": "debit",
  "recurring": false
}
Required fields: date, merchant, amount, category, type
Optional: recurring, id

Categories used: Food, Travel, Shopping, Bills, EMI, Subscriptions, Entertainment, Health, Education, Others

🔒 Security
Never commit .env or API keys.

Keep secrets safe in environment variables.

Rotate any exposed keys.

For production: set DJANGO_DEBUG=False.

🛠️ Git Hygiene
.gitignore
gitignore
Copy code
# Python / Django
.env
.venv/
venv/
__pycache__/
*.pyc
db.sqlite3
/media/
staticfiles/

# Node
node_modules/
npm-debug.log*
yarn.lock
pnpm-lock.yaml

# OS / Editor
.DS_Store
Thumbs.db
.idea/
.vscode/
.gitattributes
vbnet
Copy code
* text=auto eol=lf
*.bat eol=crlf
*.ps1 eol=crlf
*.png binary
*.jpg binary
*.jpeg binary
*.pdf binary
If you already staged junk files:

bash
Copy code
git rm -r --cached node_modules
git rm -r --cached .venv venv
git rm -r --cached __pycache__
git rm --cached db.sqlite3
git add .
git commit -m "chore: clean repo & normalize line endings"
git push origin <branch>
📦 Deployment
Backend: Deploy Django (Render, Railway, EC2, etc.).

Frontend: Deploy actual frontend (Netlify, Vercel).

Database: PostgreSQL (or SQLite for demo).

Static files: Collect via python manage.py collectstatic.

CORS: If frontend is separate, enable django-cors-headers.

🎯 Hackathon Pitch
FinBuddy proves:

✅ SMS parsing → expense tracking works.

✅ Dashboard → professional, fintech vibe.

✅ AI insights → future of smart money management.

✅ Subscription detection → innovation highlight.

✅ Chat assistant → interactive + engaging.

Future upgrades → Real SMS integration + AI-driven personalized savings. 🚀
