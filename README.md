 Lightweight Feedback System

A modern, secure feedback sharing platform for managers and team members to exchange structured feedback in a simple and friendly interface.

 🌟 Features

Core Features (MVP)
- Authentication & Roles: Manager and Employee roles with secure login
- Feedback Submission: Managers can submit structured feedback (strengths, areas to improve, sentiment)
- Feedback Visibility: Employees can view their feedback history
- Dashboard: Team overview for managers, feedback timeline for employees
- Feedback Management: Managers can edit past feedback, employees can acknowledge feedback

Bonus Features
- Modern UI: Clean, responsive design with intuitive navigation
- Real-time Updates: Instant feedback when data changes
- Search & Filter: Easy feedback discovery and organization
- Export Functionality: Download feedback data
- Responsive Design: Works on desktop and mobile devices

 🛠️ Tech Stack

Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- React Query for data fetching
- Lucide React for icons

 Backend
- Python Flask with Flask-RESTful
- SQLAlchemy ORM
- Flask-JWT-Extended for authentication
- Flask-CORS for cross-origin requests
- SQLite database (can be easily switched to PostgreSQL)

Development
- Docker for containerization
- Python 3.11+ for backend
- Node.js 18+** for frontend

 Quick Start

 Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

 Using Docker (Recommended)
```bash
# Clone the repository
git clone <your-repo-url>
cd feedback-system

# Start the entire application
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

 Local Development
```bash
# Backend Setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py

# Frontend Setup (in a new terminal)
cd frontend
npm install
npm start
```
📁 Project Structure

```
feedback-system/
├── backend/
│   ├── app.py                 # Flask application
│   ├── models.py              # Database models
│   ├── routes.py              # API routes
│   ├── auth.py                # Authentication logic
│   ├── requirements.txt       # Python dependencies
│   └── Dockerfile             # Backend Docker configuration
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API services
│   │   └── types/            # TypeScript types
│   ├── package.json          # Node.js dependencies
│   └── Dockerfile            # Frontend Docker configuration
├── docker-compose.yml        # Docker orchestration
└── README.md                 # This file
```

 🎨 Design Decisions

 Architecture
- **Monorepo Structure**: Easy to manage and deploy
- **RESTful API**: Clean, predictable API design
- **JWT Authentication**: Stateless, scalable authentication
- **SQLite for Development**: Simple setup, easy to switch to PostgreSQL for production

 UI/UX Design
- **Clean & Minimal**: Focus on content, not distractions
- **Intuitive Navigation**: Clear hierarchy and breadcrumbs
- **Responsive Design**: Works seamlessly on all devices
- **Accessibility**: WCAG compliant design patterns
- **Modern Components**: Cards, modals, and interactive elements

 Security
- **Role-based Access Control**: Strict separation between manager and employee views
- **JWT Tokens**: Secure authentication with expiration
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin request handling

🔧 API Endpoints

 Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

Feedback
- `GET /api/feedback` - Get feedback (filtered by role)
- `POST /api/feedback` - Create new feedback
- `PUT /api/feedback/<id>` - Update feedback
- `DELETE /api/feedback/<id>` - Delete feedback
- `POST /api/feedback/<id>/acknowledge` - Acknowledge feedback

 Users
- `GET /api/users/team` - Get team members (managers only)
- `GET /api/users/<id>` - Get user details

🐳 Docker Configuration

The application includes Docker configurations for easy deployment:

- **Backend Dockerfile**: Python Flask application with all dependencies
- **Frontend Dockerfile**: React application with optimized build
- **Docker Compose**: Orchestrates both services with proper networking

🚀 Deployment

 Using Docker
```bash
# Build and run with Docker Compose
docker-compose up --build -d

# Scale services if needed
docker-compose up --scale backend=2 --scale frontend=2
```

 Manual Deployment
1. Set up a server with Python 3.11+ and Node.js 18+
2. Clone the repository
3. Follow the local development setup
4. Configure environment variables
5. Set up a reverse proxy (nginx) for production

 🔒 Environment Variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
DATABASE_URL=sqlite:///feedback.db
FLASK_ENV=development
```

📝 License

This project is created for demonstration purposes.
 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

Built with ❤️ for better team communication and feedback culture. # DPD0Project
