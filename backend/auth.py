from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User, Feedback
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Username and password are required'}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    
    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
    else:
        return jsonify({'error': 'Invalid username or password'}), 401

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Username, email, and password are required'}), 400
    
    # Check if user already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    # Create new user
    user = User(
        username=data['username'],
        email=data['email'],
        role=data.get('role', 'employee')
    )
    user.set_password(data['password'])
    
    # Set manager if provided
    if data.get('manager_id'):
        manager = User.query.get(data['manager_id'])
        if manager and manager.role == 'manager':
            user.manager_id = data['manager_id']
    
    db.session.add(user)
    db.session.commit()
    
    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'access_token': access_token,
        'user': user.to_dict()
    }), 201

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user.to_dict()), 200

def create_demo_users():
    """Create demo users for testing"""
    # Create manager
    manager = User(
        username='manager',
        email='manager@company.com',
        role='manager'
    )
    manager.set_password('password123')
    db.session.add(manager)
    db.session.commit()
    
    # Create employees
    employees = [
        {
            'username': 'john_doe',
            'email': 'john@company.com',
            'role': 'employee'
        },
        {
            'username': 'jane_smith',
            'email': 'jane@company.com',
            'role': 'employee'
        },
        {
            'username': 'mike_wilson',
            'email': 'mike@company.com',
            'role': 'employee'
        }
    ]
    
    for emp_data in employees:
        employee = User(
            username=emp_data['username'],
            email=emp_data['email'],
            role=emp_data['role'],
            manager_id=manager.id
        )
        employee.set_password('password123')
        db.session.add(employee)
    
    db.session.commit()
    
    # Create some sample feedback
    sample_feedback = [
        {
            'giver_id': manager.id,
            'receiver_id': manager.team_members[0].id,
            'strengths': 'Excellent communication skills and strong technical knowledge. Always meets deadlines and helps team members.',
            'areas_to_improve': 'Could take more initiative in leading team discussions and presenting ideas.',
            'sentiment': 'positive'
        },
        {
            'giver_id': manager.id,
            'receiver_id': manager.team_members[1].id,
            'strengths': 'Great problem-solving abilities and attention to detail. Very reliable team player.',
            'areas_to_improve': 'Could improve time management and prioritize tasks better.',
            'sentiment': 'positive'
        },
        {
            'giver_id': manager.id,
            'receiver_id': manager.team_members[2].id,
            'strengths': 'Creative thinker with innovative ideas. Good at brainstorming sessions.',
            'areas_to_improve': 'Needs to improve documentation skills and follow up on action items.',
            'sentiment': 'neutral'
        }
    ]
    
    for feedback_data in sample_feedback:
        feedback = Feedback(**feedback_data)
        db.session.add(feedback)
    
    db.session.commit()
    print("Demo users and feedback created successfully!") 