# 🖥️ NALCO Data Center Dashboard Manager

> A production-ready Flask web application for real-time monitoring and management of data center servers — with role-based access control, rack-based visualization, and full CRUD operations.

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?style=flat-square&logo=python)
![Flask](https://img.shields.io/badge/Flask-3.x-black?style=flat-square&logo=flask)
![SQLite](https://img.shields.io/badge/SQLite-Database-lightblue?style=flat-square&logo=sqlite)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ Features

- 🔐 **User Authentication** — Secure login & registration with hashed passwords (Werkzeug)
- 👥 **Role-Based Access** — Admin and standard user roles with protected routes
- 📊 **Live Dashboard** — Real-time server stats: total, active, down, and maintenance counts
- 🗂️ **Rack & Row Visualization** — Servers organized into racks with color-coded status indicators
- ➕ **Full CRUD** — Admins can add, edit, and delete servers or entire racks
- 🔍 **Search & Filter** — Filter servers by name, IP, or status in real time
- 📡 **REST API** — JSON endpoints for all data operations
- 🌱 **Auto Seeding** — Automatically seeds the database from `Data/servers.csv` on first run
- 🌙 **Dark Professional UI** — Industrial dark theme built with IBM Plex fonts

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.10+, Flask |
| Database | SQLite (via Flask-SQLAlchemy ORM) |
| Auth | Werkzeug password hashing |
| Frontend | HTML5, CSS3, Vanilla JS, Axios |
| Fonts | IBM Plex Sans + IBM Plex Mono |

> SQLite can be swapped for MySQL or PostgreSQL by changing one line in `app.py`.

---

## 📂 Project Structure

```
DataCenterMap/
├── app.py                  # Main Flask application & API routes
├── models.py               # SQLAlchemy models (Server, User)
├── requirements.txt        # Python dependencies
├── Data/
│   └── servers.csv         # Seed data for initial server entries
├── instance/
│   └── servers.db          # SQLite database (auto-created)
├── static/
│   ├── app.js              # Frontend logic (render, CRUD, filters)
│   ├── style.css           # Custom dark theme stylesheet
│   └── nalco-logo.png      # Brand logo
└── templates/
    ├── login.html          # Login page
    ├── register.html       # Registration page
    ├── dashboard.html      # Main dashboard
    ├── help_login.html     # Login help page
    └── help_register.html  # Register help page
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10 or higher
- pip

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/your-username/DataCenterMap.git
cd DataCenterMap
```

**2. Create and activate a virtual environment**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python -m venv venv
source venv/bin/activate
```

**3. Install dependencies**
```bash
pip install -r requirements.txt
```

**4. Run the application**
```bash
python app.py
```

**5. Open in your browser**
```
http://localhost:5001
```

---

## 🔑 Default Credentials

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `admin123` |

> The admin account is created automatically on first run. **Change the password after your first login.**

---

## 📡 API Reference

All endpoints require an active session (login first).

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/data` | User | Get all servers |
| `POST` | `/api/add` | Admin | Add a new server |
| `POST` | `/api/update` | Admin | Update an existing server |
| `POST` | `/api/delete` | Admin | Delete a server by IP |
| `POST` | `/api/delete_rack` | Admin | Delete all servers in a rack |

### Example — Add Server
```json
POST /api/add
{
  "name": "WebServer-5",
  "ip": "10.0.4.1",
  "status": "Active",
  "cpu": "8 cores",
  "ram": "32GB",
  "rack": 6,
  "row": "F",
  "last_maintenance": "2025-06-01"
}
```

---

## 🗄️ Database

The app uses **SQLite** by default. To switch to PostgreSQL or MySQL, update this line in `app.py`:

```python
# SQLite (default)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///servers.db'

# PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@localhost/dbname'

# MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://user:password@localhost/dbname'
```

---

## 🌱 Seeding Data

On first run, the app automatically imports servers from `Data/servers.csv` if the database is empty.

CSV format:
```
name,ip,status,cpu,ram,rack,row,last_maintenance
WebServer-1,10.0.1.1,Active,8 cores,16GB,1,A,2025-05-01
```

---

## 🔒 Security Notes

- All passwords are hashed using Werkzeug's `generate_password_hash`
- Change `app.secret_key` in `app.py` before deploying to production
- Admin-only routes are protected server-side via session role checks
- For production, use a proper WSGI server (e.g. Gunicorn) behind Nginx

---

## 🛣️ Roadmap

- [ ] Export server list to PDF / Excel
- [ ] Live ping / auto-refresh server status
- [ ] User management page for admins
- [ ] Audit log (track who changed what)
- [ ] Dark/light theme toggle

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">Built with ❤️ for NALCO Data Center Operations</p>
