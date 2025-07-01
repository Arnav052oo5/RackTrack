# 🖥️ Data Centre Dashboard Manager

A Flask-based web application for real-time monitoring and management of servers in a data center environment. The dashboard allows authenticated users to view server status, track hardware usage, and manage server entries with full CRUD (Create, Read, Update, Delete) operations.

---

## 🚀 Features

- 🔐 **User Authentication** (Login/Register with roles)
- 📊 **Dashboard** with real-time server status (CPU, RAM, status, maintenance)
- ➕ **Add/Delete/Update** server entries (Admin only)
- 📡 **API Endpoints** for server data operations
- 📁 Organized by Racks & Rows
- 🧑‍💼 Admin role initialised by default (`admin` / `admin123`)

---

## 🧱 Tech Stack

- **Python** with **Flask**
- **SQLite** for backend storage (easily extendable to MySQL/PostgreSQL)
- **Flask-SQLAlchemy** ORM
- **Werkzeug** for password security
- HTML Templates (to be placed inside `templates/` folder)

---

## 📂 Project Structure
├── app.py # Main Flask application
├── models.py # Database models (Server, User)
├── requirements.txt # Dependencies
└── templates/ # HTML templates (login.html, dashboard.html, etc.)

