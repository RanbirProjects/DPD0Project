# 🚀 Lightweight Feedback System

A **modern and secure feedback sharing platform** that enables **Managers and Employees** to exchange structured feedback in a clean and intuitive interface.

Built with a **full-stack architecture using React, TypeScript, Python Flask, and Docker**.

---

## 📸 Application Preview

### 📊 Dashboard
![Dashboard](https://github.com/user-attachments/assets/5c5215cf-7ae4-4869-93a4-80c86e24c0f4)

### 👥 Team Management
![Team](https://github.com/user-attachments/assets/fd846053-ba12-49b9-8047-0c852ca92087)

### 💬 Feedback Panel
![Feedback](https://github.com/user-attachments/assets/c59bbf6c-858b-475c-beeb-dfcad6848aab)

### 📈 Feedback History
![Feedback History](https://github.com/user-attachments/assets/00f6c5bd-2003-4240-8953-5eadf598bdb6)

---

# ✨ Features

## 🧩 Core Features (MVP)

### 🔐 Authentication & Roles
- Secure **JWT-based authentication**
- Role-based access:
  - **Manager**
  - **Employee**

### 📝 Feedback Submission
Managers can provide structured feedback including:

- Strengths
- Areas of improvement
- Sentiment rating

### 👁️ Feedback Visibility
Employees can:

- View their feedback history
- Track feedback timeline
- Acknowledge feedback received

### 📊 Dashboard
- **Manager View**
  - Team overview
  - Feedback management

- **Employee View**
  - Personal feedback timeline

### ✏️ Feedback Management
Managers can:

- Edit feedback
- Update comments
- Track acknowledgement status

---

# 🌟 Bonus Features

- ⚡ **Real-time feedback updates**
- 🔍 **Search & filtering**
- 📥 **Export feedback reports**
- 📱 **Fully responsive design**
- 🎨 **Modern UI with Tailwind CSS**
- 🧭 **Clean navigation experience**

---

# 🛠️ Tech Stack

## Frontend

- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **React Router**
- **React Query**
- **Lucide React Icons**

---

## Backend

- **Python Flask**
- **Flask-RESTful**
- **SQLAlchemy ORM**
- **Flask-JWT-Extended**
- **Flask-CORS**
- **SQLite Database**

> Database can easily be switched to **PostgreSQL for production**

---

# ⚙️ Development Tools

- 🐳 **Docker**
- 🐍 **Python 3.11+**
- 🟢 **Node.js 18+**

---

# 🚀 Quick Start

## 📦 Prerequisites

Make sure you have installed:

- Docker
- Docker Compose
- Node.js 18+
- Python 3.11+

---

# 🐳 Run Using Docker (Recommended)

Clone the repository:

```bash
git clone https://github.com/your-username/feedback-system.git
cd feedback-system

Start the application:

docker-compose up --build

Access the application:

Frontend

http://localhost:3000

Backend API

http://localhost:5000
💻 Local Development
Backend Setup
cd backend

python -m venv venv

source venv/bin/activate
# Windows
venv\Scripts\activate

pip install -r requirements.txt

python app.py
Frontend Setup

Open another terminal:

cd frontend

npm install

npm start
📁 Project Structure
feedback-system/
│
├── backend/
│   ├── app.py
│   ├── models.py
│   ├── routes.py
│   ├── auth.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
🎨 Design Principles
Architecture

Monorepo architecture

RESTful API design

Stateless JWT authentication

Modular component structure

UI / UX

Clean minimal interface

Responsive layouts

Accessibility friendly

Clear navigation hierarchy

🔒 Security Features

Role-based access control

JWT token authentication

Secure API validation

CORS configuration

🔌 API Endpoints
Authentication
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/profile
Feedback
GET    /api/feedback
POST   /api/feedback
PUT    /api/feedback/:id
DELETE /api/feedback/:id
POST   /api/feedback/:id/acknowledge
Users
GET /api/users/team
GET /api/users/:id
🐳 Docker Setup

This project includes Docker support:

Backend container

Frontend container

Docker Compose orchestration

Run production mode:

docker-compose up --build -d

Scale services:

docker-compose up --scale backend=2 --scale frontend=2
🔧 Environment Variables

Create .env inside backend

SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
DATABASE_URL=sqlite:///feedback.db
FLASK_ENV=development
🚀 Deployment

You can deploy using:

Docker

AWS

DigitalOcean

Render

Railway

Recommended production stack:

React + Nginx
Flask + Gunicorn
PostgreSQL
Docker
🤝 Contributing

Fork repository

Create feature branch

git checkout -b feature/new-feature

Commit changes

git commit -m "Add new feature"

Push to branch

git push origin feature/new-feature

Open Pull Request

📝 License

This project is licensed under the MIT License.

❤️ Author

Ranbir Singh

Full Stack Developer (MERN)

GitHub
https://github.com/RanbirProjects

LinkedIn
https://www.linkedin.com/in/ranbirsingh1001/

LeetCode
https://leetcode.com/u/ranbirsingh7/
