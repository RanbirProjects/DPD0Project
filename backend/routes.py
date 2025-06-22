from flask import Blueprint, request, jsonify
from extensions import db
from models import User, Feedback, FeedbackRequest, Comment, Notification
from datetime import datetime
import json

# Create blueprints
feedback_bp = Blueprint('feedback', __name__)
user_bp = Blueprint('users', __name__)
notification_bp = Blueprint('notifications', __name__)

# Helper function to get user by ID
def get_user_by_id(user_id):
    return User.query.get(user_id)

# Feedback routes
@feedback_bp.route('/', methods=['GET'])
def get_all_feedback():
    """Get all feedback with comments and tags"""
    feedback_list = Feedback.query.all()
    result = []
    
    for feedback in feedback_list:
        feedback_data = {
            'id': feedback.id,
            'strengths': feedback.strengths,
            'areas_to_improve': feedback.areas_to_improve,
            'sentiment': feedback.sentiment,
            'tags': feedback.tags if feedback.tags else [],
            'giver_name': get_user_by_id(feedback.giver_id).username,
            'receiver_name': get_user_by_id(feedback.receiver_id).username,
            'created_at': feedback.created_at.isoformat(),
            'comments': []
        }
        
        # Add comments
        for comment in feedback.comments:
            comment_data = {
                'id': comment.id,
                'content': comment.content,
                'author_name': get_user_by_id(comment.user_id).username,
                'created_at': comment.created_at.isoformat()
            }
            feedback_data['comments'].append(comment_data)
        
        result.append(feedback_data)
    
    return jsonify(result)

@feedback_bp.route('/', methods=['POST'])
def create_feedback():
    """Create new feedback"""
    data = request.get_json()
    
    # Validate required fields
    if not all(key in data for key in ['receiver_id', 'strengths', 'areas_to_improve']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Create feedback
    feedback = Feedback(
        giver_id=data.get('giver_id', 1),  # Default to first user for demo
        receiver_id=data['receiver_id'],
        strengths=data['strengths'],
        areas_to_improve=data['areas_to_improve'],
        sentiment=data.get('sentiment', 'neutral'),
        tags=data.get('tags', [])
    )
    
    db.session.add(feedback)
    db.session.commit()
    
    # Create notification
    notification = Notification(
        user_id=data['receiver_id'],
        title='New Feedback Received',
        message=f'You have received new {data.get("sentiment", "neutral")} feedback',
        type='feedback'
    )
    db.session.add(notification)
    db.session.commit()
    
    return jsonify({
        'id': feedback.id,
        'message': 'Feedback created successfully'
    }), 201

@feedback_bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    """Get dashboard data"""
    # Get all users
    users = User.query.all()
    
    # Get all feedback
    feedback_list = Feedback.query.all()
    
    # Calculate statistics
    total_feedback = len(feedback_list)
    sentiment_counts = {
        'positive': len([f for f in feedback_list if f.sentiment == 'positive']),
        'neutral': len([f for f in feedback_list if f.sentiment == 'neutral']),
        'negative': len([f for f in feedback_list if f.sentiment == 'negative'])
    }
    
    # Get recent feedback
    recent_feedback = []
    for feedback in feedback_list[-5:]:  # Last 5 feedback
        feedback_data = {
            'id': feedback.id,
            'strengths': feedback.strengths[:100] + '...' if len(feedback.strengths) > 100 else feedback.strengths,
            'areas_to_improve': feedback.areas_to_improve[:100] + '...' if len(feedback.areas_to_improve) > 100 else feedback.areas_to_improve,
            'sentiment': feedback.sentiment,
            'tags': feedback.tags if feedback.tags else [],
            'giver_name': get_user_by_id(feedback.giver_id).username,
            'receiver_name': get_user_by_id(feedback.receiver_id).username,
            'created_at': feedback.created_at.isoformat()
        }
        recent_feedback.append(feedback_data)
    
    # Get feedback requests
    requests = FeedbackRequest.query.all()
    feedback_requests = []
    for req in requests:
        request_data = {
            'id': req.id,
            'requester_name': get_user_by_id(req.requester_id).username,
            'receiver_name': get_user_by_id(req.receiver_id).username,
            'message': req.message,
            'tags': req.tags if req.tags else [],
            'priority': req.priority,
            'due_date': req.due_date.isoformat() if req.due_date else None,
            'created_at': req.created_at.isoformat()
        }
        feedback_requests.append(request_data)
    
    return jsonify({
        'total_feedback': total_feedback,
        'sentiment_counts': sentiment_counts,
        'team_size': len(users),
        'recent_feedback': recent_feedback,
        'feedback_requests': feedback_requests
    })

@feedback_bp.route('/request', methods=['POST'])
def request_feedback():
    """Request feedback from someone"""
    data = request.get_json()
    
    if not all(key in data for key in ['receiver_id']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    request_obj = FeedbackRequest(
        requester_id=data.get('requester_id', 1),  # Default to first user
        receiver_id=data['receiver_id'],
        message=data.get('message', ''),
        tags=data.get('tags', []),
        priority=data.get('priority', 'medium'),
        due_date=datetime.fromisoformat(data['due_date']) if data.get('due_date') else None
    )
    
    db.session.add(request_obj)
    db.session.commit()
    
    # Create notification
    notification = Notification(
        user_id=data['receiver_id'],
        title='Feedback Request',
        message=f'Someone has requested feedback from you',
        type='request'
    )
    db.session.add(notification)
    db.session.commit()
    
    return jsonify({
        'id': request_obj.id,
        'message': 'Feedback request created successfully'
    }), 201

@feedback_bp.route('/requests', methods=['GET'])
def get_feedback_requests():
    """Get all feedback requests"""
    requests = FeedbackRequest.query.all()
    result = []
    
    for req in requests:
        request_data = {
            'id': req.id,
            'requester_name': get_user_by_id(req.requester_id).username,
            'receiver_name': get_user_by_id(req.receiver_id).username,
            'message': req.message,
            'tags': req.tags if req.tags else [],
            'priority': req.priority,
            'due_date': req.due_date.isoformat() if req.due_date else None,
            'created_at': req.created_at.isoformat()
        }
        result.append(request_data)
    
    return jsonify(result)

@feedback_bp.route('/<int:feedback_id>/comments', methods=['POST'])
def add_comment(feedback_id):
    """Add comment to feedback"""
    data = request.get_json()
    
    if not data.get('content'):
        return jsonify({'error': 'Comment content is required'}), 400
    
    comment = Comment(
        feedback_id=feedback_id,
        author_id=data.get('author_id', 1),  # Default to first user
        content=data['content']
    )
    
    db.session.add(comment)
    db.session.commit()
    
    return jsonify({
        'id': comment.id,
        'message': 'Comment added successfully'
    }), 201

@feedback_bp.route('/<int:feedback_id>/export', methods=['GET'])
def export_feedback_pdf(feedback_id):
    """Export feedback as PDF (mock implementation)"""
    feedback = Feedback.query.get(feedback_id)
    if not feedback:
        return jsonify({'error': 'Feedback not found'}), 404
    
    # Mock PDF generation - in real implementation, you'd use a library like reportlab
    pdf_content = f"""
    Feedback Report
    
    From: {get_user_by_id(feedback.giver_id).username}
    To: {get_user_by_id(feedback.receiver_id).username}
    Date: {feedback.created_at.strftime('%Y-%m-%d')}
    Sentiment: {feedback.sentiment}
    Tags: {', '.join(feedback.tags) if feedback.tags else 'None'}
    
    Content:
    {feedback.strengths}
    
    Areas to Improve:
    {feedback.areas_to_improve}
    
    Comments:
    """
    
    for comment in feedback.comments:
        pdf_content += f"\n- {get_user_by_id(comment.user_id).username}: {comment.content}"
    
    # Return as text for now - in real implementation, return actual PDF
    return jsonify({
        'content': pdf_content,
        'filename': f'feedback-{feedback_id}.txt'
    })

@feedback_bp.route('/by-tags', methods=['GET'])
def get_feedback_by_tags():
    """Get feedback filtered by tags"""
    tags = request.args.get('tags', '').split(',')
    if not tags or tags == ['']:
        return jsonify({'error': 'Tags parameter is required'}), 400
    
    feedback_list = Feedback.query.all()
    result = []
    
    for feedback in feedback_list:
        feedback_tags = json.loads(feedback.tags) if feedback.tags else []
        if any(tag in feedback_tags for tag in tags):
            feedback_data = {
                'id': feedback.id,
                'strengths': feedback.strengths,
                'areas_to_improve': feedback.areas_to_improve,
                'sentiment': feedback.sentiment,
                'tags': feedback_tags,
                'giver_name': get_user_by_id(feedback.giver_id).username,
                'receiver_name': get_user_by_id(feedback.receiver_id).username,
                'created_at': feedback.created_at.isoformat()
            }
            result.append(feedback_data)
    
    return jsonify(result)

@feedback_bp.route('/team', methods=['GET'])
def get_team_members():
    """Get team members for feedback forms"""
    users = User.query.all()
    result = []
    
    for user in users:
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'created_at': user.created_at.isoformat()
        }
        result.append(user_data)
    
    return jsonify(result)

# User routes
@user_bp.route('/', methods=['GET'])
def get_all_users():
    """Get all users with their feedback data"""
    users = User.query.all()
    result = []
    
    for user in users:
        # Get feedback received by this user
        feedback_received = Feedback.query.filter_by(receiver_id=user.id).all()
        feedback_data = []
        
        for feedback in feedback_received:
            feedback_data.append({
                'id': feedback.id,
                'strengths': feedback.strengths,
                'areas_to_improve': feedback.areas_to_improve,
                'sentiment': feedback.sentiment,
                'created_at': feedback.created_at.isoformat()
            })
        
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'created_at': user.created_at.isoformat(),
            'feedback_received': feedback_data
        }
        result.append(user_data)
    
    return jsonify(result)

@user_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get specific user"""
    user = get_user_by_id(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role,
        'created_at': user.created_at.isoformat()
    })

@user_bp.route('/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """Update user profile"""
    user = get_user_by_id(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    if 'username' in data:
        user.username = data['username']
    if 'email' in data:
        user.email = data['email']
    
    db.session.commit()
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role,
        'created_at': user.created_at.isoformat()
    })

# Notification routes
@notification_bp.route('/', methods=['GET'])
def get_notifications():
    """Get all notifications"""
    notifications = Notification.query.order_by(Notification.created_at.desc()).all()
    result = []
    
    for notification in notifications:
        notification_data = {
            'id': notification.id,
            'title': notification.title,
            'message': notification.message,
            'type': notification.type,
            'read': notification.read,
            'created_at': notification.created_at.isoformat()
        }
        result.append(notification_data)
    
    return jsonify(result)

@notification_bp.route('/<int:notification_id>/read', methods=['PUT'])
def mark_notification_read(notification_id):
    """Mark notification as read"""
    notification = Notification.query.get(notification_id)
    if not notification:
        return jsonify({'error': 'Notification not found'}), 404
    
    notification.read = True
    db.session.commit()
    
    return jsonify({
        'id': notification.id,
        'message': 'Notification marked as read'
    })

@notification_bp.route('/', methods=['POST'])
def create_notification():
    """Create new notification"""
    data = request.get_json()
    
    if not all(key in data for key in ['user_id', 'title', 'message']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    notification = Notification(
        user_id=data['user_id'],
        title=data['title'],
        message=data['message'],
        type=data.get('type', 'general')
    )
    
    db.session.add(notification)
    db.session.commit()
    
    return jsonify({
        'id': notification.id,
        'message': 'Notification created successfully'
    }), 201 