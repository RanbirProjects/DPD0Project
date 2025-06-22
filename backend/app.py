from flask import Flask
from flask_migrate import Migrate
from config import Config
from extensions import db, cors

# Initialize extensions
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    cors(app)

    # Import models after initializing extensions
    import models

    # Import and register blueprints
    from routes import feedback_bp, user_bp, notification_bp
    app.register_blueprint(feedback_bp, url_prefix='/api/feedback')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(notification_bp, url_prefix='/api/notifications')

    # Health check endpoint
    @app.route('/api/health')
    def health_check():
        return {'status': 'healthy', 'message': 'Feedback system is running'}

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        # Create all tables
        db.create_all()
    app.run(host='0.0.0.0', port=5002, debug=True) 