from extensions import db
from models import User, Feedback, FeedbackRequest, Comment, Notification
from app import create_app
import json
from datetime import datetime, timedelta

def init_db():
    app = create_app()
    
    with app.app_context():
        # Drop all tables and recreate them
        db.drop_all()
        db.create_all()
        
        print("Tables created successfully!")
        
        # Create demo users (multiple teams)
        managers = [
            User(username='manager1', email='manager1@company.com', role='manager'),
            User(username='manager2', email='manager2@company.com', role='manager'),
        ]
        for m in managers:
            m.set_password('password123')
            db.session.add(m)
        db.session.commit()
        
        employees = [
            User(username='alice', email='alice@company.com', role='employee', manager_id=managers[0].id),
            User(username='bob', email='bob@company.com', role='employee', manager_id=managers[0].id),
            User(username='carol', email='carol@company.com', role='employee', manager_id=managers[0].id),
            User(username='dave', email='dave@company.com', role='employee', manager_id=managers[1].id),
            User(username='eve', email='eve@company.com', role='employee', manager_id=managers[1].id),
            User(username='frank', email='frank@company.com', role='employee', manager_id=managers[1].id),
        ]
        for e in employees:
            e.set_password('password123')
            db.session.add(e)
        db.session.commit()
        print("Managers and employees created successfully!")
        
        # Create demo feedback
        feedback_data = [
            {
                'giver_id': 1,  # manager1
                'receiver_id': 3,  # alice
                'strengths': '**Excellent work** on the recent project! Your *communication skills* and `technical expertise` really stood out.',
                'areas_to_improve': 'Consider taking on more leadership opportunities in team meetings.',
                'sentiment': 'positive',
                'tags': ['communication', 'technical-skills', 'leadership']
            },
            {
                'giver_id': 1,  # manager1
                'receiver_id': 4,  # bob
                'strengths': 'Good effort on the team collaboration and problem-solving.',
                'areas_to_improve': 'Consider improving your time management to meet deadlines more consistently.',
                'sentiment': 'neutral',
                'tags': ['teamwork', 'time-management']
            },
            {
                'giver_id': 3,  # alice
                'receiver_id': 1,  # manager1
                'strengths': '**Great leadership**! Your guidance has been invaluable. *Clear communication* and supportive approach.',
                'areas_to_improve': 'Could provide more regular check-ins with team members.',
                'sentiment': 'positive',
                'tags': ['leadership', 'communication']
            },
            {
                'giver_id': 4,  # bob
                'receiver_id': 5,  # carol
                'strengths': 'Your creativity in problem-solving is impressive. The innovative approach you took really helped the team.',
                'areas_to_improve': 'Could improve documentation of your solutions for future reference.',
                'sentiment': 'positive',
                'tags': ['creativity', 'problem-solving']
            },
            {
                'giver_id': 5,  # carol
                'receiver_id': 3,  # alice
                'strengths': 'Good technical skills and attention to detail.',
                'areas_to_improve': 'Could improve on documentation and knowledge sharing with the team.',
                'sentiment': 'neutral',
                'tags': ['technical-skills', 'collaboration']
            }
        ]
        
        for feedback_info in feedback_data:
            feedback = Feedback(
                giver_id=feedback_info['giver_id'],
                receiver_id=feedback_info['receiver_id'],
                strengths=feedback_info['strengths'],
                areas_to_improve=feedback_info['areas_to_improve'],
                sentiment=feedback_info['sentiment'],
                tags=feedback_info['tags']
            )
            db.session.add(feedback)
        
        db.session.commit()
        print("Feedback created successfully!")
        
        # Create demo comments
        comments_data = [
            {
                'feedback_id': 1,
                'user_id': 3,  # alice
                'content': 'Thank you for the feedback! I appreciate the recognition.'
            },
            {
                'feedback_id': 1,
                'user_id': 1,  # manager1
                'content': 'You\'re welcome! Keep up the excellent work.'
            },
            {
                'feedback_id': 3,
                'user_id': 1,  # manager1
                'content': 'Thank you for the feedback. I\'m glad I can be supportive.'
            }
        ]
        
        for comment_info in comments_data:
            comment = Comment(
                feedback_id=comment_info['feedback_id'],
                user_id=comment_info['user_id'],
                content=comment_info['content']
            )
            db.session.add(comment)
        
        db.session.commit()
        print("Comments created successfully!")
        
        # Create demo feedback requests
        requests_data = [
            {
                'requester_id': 3,  # alice
                'receiver_id': 4,  # bob
                'message': 'Could you provide feedback on my recent presentation skills?',
                'tags': ['communication', 'presentation'],
                'priority': 'medium',
                'due_date': datetime.utcnow() + timedelta(days=7)
            },
            {
                'requester_id': 5,  # carol
                'receiver_id': 1,  # manager1
                'message': 'I\'d like feedback on my project management approach.',
                'tags': ['leadership', 'project-management'],
                'priority': 'high',
                'due_date': datetime.utcnow() + timedelta(days=3)
            }
        ]
        
        for request_info in requests_data:
            request_obj = FeedbackRequest(
                requester_id=request_info['requester_id'],
                receiver_id=request_info['receiver_id'],
                message=request_info['message'],
                tags=request_info['tags'],
                priority=request_info['priority'],
                due_date=request_info['due_date']
            )
            db.session.add(request_obj)
        
        db.session.commit()
        print("Feedback requests created successfully!")
        
        # Create demo notifications
        notifications_data = [
            {
                'user_id': 2,
                'title': 'New Feedback Received',
                'message': 'You have received new positive feedback from manager',
                'type': 'feedback'
            },
            {
                'user_id': 3,
                'title': 'Feedback Request',
                'message': 'employee1 has requested feedback from you',
                'type': 'request'
            },
            {
                'user_id': 1,
                'title': 'New Feedback Received',
                'message': 'You have received new positive feedback (anonymous)',
                'type': 'feedback'
            }
        ]
        
        for notification_info in notifications_data:
            notification = Notification(
                user_id=notification_info['user_id'],
                title=notification_info['title'],
                message=notification_info['message'],
                type=notification_info['type']
            )
            db.session.add(notification)
        
        db.session.commit()
        print("Notifications created successfully!")
        
        print("\nDatabase initialized with demo data!")
        print(f"Created {len(managers)} managers and {len(employees)} employees")
        print(f"Created {len(feedback_data)} feedback entries")
        print(f"Created {len(comments_data)} comments")
        print(f"Created {len(requests_data)} feedback requests")
        print(f"Created {len(notifications_data)} notifications")

if __name__ == '__main__':
    init_db() 