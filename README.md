# Vantage AI — Expense Tracker

## Overview

Vantage AI is a web-based expense tracker with a voice-first interface (site title: "Vantage AI - Voice-Powered Expense Tracker"). The app helps users record and review expenses with minimal typing by leveraging voice input on the client side.

> NOTE: I confirmed the site title from the live URL you provided. I could not access the fully rendered UI or backend from the crawler. The sections below contain a few placeholders where I need quick confirmations so the README matches the actual implementation.

---

## Live demo

* Live site: `https://amazing-stardust-ab34d2.netlify.app`

---

## Key features

(Please confirm which of these are implemented; strike out what is not applicable.)

* Voice input to add expenses (voice → parsed amount, category, description). `<<CONFIRM: Is voice input implemented? If yes, does it parse amount/category? >>`
* Create / Read / Update / Delete (CRUD) expenses. `<<CONFIRM: Is basic CRUD available?>>
* View expenses by day / month and simple summaries (total spent, category breakdown). `<<CONFIRM: Are analytics/summary charts implemented? If yes, which ones?>>`
* Export expenses to CSV. `<<CONFIRM: Export available?>>`
* Optional user authentication (local or third-party). `<<CONFIRM: Is there login/signup?>`
* Offline support (service worker / local storage). `<<CONFIRM if applicable>>`

If any of the items above are not implemented, please let me know which ones are incorrect, and I will remove them.

---

## Tech stack

Please replace or confirm the exact stack used by the project:

* Frontend: `<<FRONTEND_FRAMEWORK: e.g., React / Vue / plain HTML+JS>>`
* Backend: `<<BACKEND: e.g., Node/Express, Flask, Firebase functions, or none (static) >>`
* Database / Storage: `<<DB: e.g., Firebase Firestore, MongoDB, SQLite, localStorage>>`
* Hosting / Deployment: Netlify (confirmed from URL).
  Please provide the missing tech names, and I will update this section.

---

## Getting started (local development)

Below are generic steps. I’ll tailor these after you confirm the tech stack.

### Prerequisites

* Node.js and npm / yarn (if frontend uses Node)
* Python (if backend is Python-based)
* Git

### Clone

```bash
git clone https://github.com/<your-username>/vantage-ai-expense-tracker.git
cd vantage-ai-expense-tracker
```

### Install & run (example — replace with your actual commands)

If the frontend uses Node:

```bash
cd frontend
npm install
npm start
# opens at http://localhost:3000
```

If there is a backend:

```bash
cd backend
# Python example
pip install -r requirements.txt
python app.py
# or Node:
npm install
npm start
```

If the app is a static client that uses an external DB (e.g., Firebase) then running only the frontend may be sufficient.

---

## Usage

* Open the app in a supported browser (Chrome is recommended for the Web Speech API).
* Use the microphone button (or hotkey) to say: e.g., “Spent 350 on groceries” or “Add 200 rupees transport”.
* Confirm parsed fields (amount, category, description) and save.
* View summaries on the dashboard by selecting a date range or month.

`<<CONFIRM: Please describe the exact voice command grammar and the presence of any confirmation step.>>`

---

## Configuration

* Environment variables / config files needed (examples—please confirm and provide actual keys & names):

  * `REACT_APP_API_URL` — backend API endpoint
  * `FIREBASE_CONFIG` — Firebase credentials (if used)
  * `NODE_ENV` / `.env` settings for local development

---

## Roadmap

(Choose what you want included; these are common additions.)

* Improved AI-driven expense categorization
* Predictive budgeting and alerts
* Multi-user accounts and secure auth
* Mobile app (React Native)
* Connectors to bank statements / Plaid (if applicable)

---

## Contributing

* Fork the repo, create a feature branch, open a PR.
* Add changelog entry for new features.
* Include tests for backend routes or critical frontend components.

---

DEMO URL SOON!
