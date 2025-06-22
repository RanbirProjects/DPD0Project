import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  Target,
  Award,
  Activity,
  Plus,
  ArrowRight,
  Bell,
  FileText,
  Tag,
  Download
} from 'lucide-react';
import { feedbackAPI, notificationAPI } from '../services/api';
import { DashboardData, Feedback, FeedbackRequest } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const { data: dashboardData, isLoading, error } = useQuery<DashboardData>(
    'dashboard',
    feedbackAPI.getDashboard,
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  const { data: notifications } = useQuery(
    'notifications',
    notificationAPI.getAll,
    {
      refetchInterval: 10000, // Refetch every 10 seconds
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    console.log('Dashboard error:', error);
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Error loading dashboard</div>
        <p className="text-gray-600">Please try again later.</p>
      </div>
    );
  }

  if (!dashboardData) return null;

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-success-600 bg-success-100';
      case 'negative':
        return 'text-danger-600 bg-danger-100';
      default:
        return 'text-warning-600 bg-warning-100';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-4 w-4" />;
      case 'negative':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const calculateAcknowledgmentRate = () => {
    if (dashboardData.role === 'employee' && dashboardData.total_feedback > 0) {
      return ((dashboardData.acknowledged_count || 0) / dashboardData.total_feedback * 100).toFixed(1);
    }
    return '0';
  };

  const getPerformanceScore = () => {
    if (dashboardData.total_feedback === 0) return 0;
    const positiveWeight = 3;
    const neutralWeight = 1;
    const negativeWeight = -1;
    
    const totalScore = (
      dashboardData.sentiment_counts.positive * positiveWeight +
      dashboardData.sentiment_counts.neutral * neutralWeight +
      dashboardData.sentiment_counts.negative * negativeWeight
    );
    
    const maxPossibleScore = dashboardData.total_feedback * positiveWeight;
    return Math.max(0, (totalScore / maxPossibleScore) * 100).toFixed(1);
  };

  const getFeedbackTrend = () => {
    if (dashboardData.recent_feedback.length < 2) return 'stable';
    const recent = dashboardData.recent_feedback.slice(0, 3);
    const positiveCount = recent.filter(f => f.sentiment === 'positive').length;
    const negativeCount = recent.filter(f => f.sentiment === 'negative').length;
    
    if (positiveCount > negativeCount) return 'improving';
    if (negativeCount > positiveCount) return 'declining';
    return 'stable';
  };

  const getTrendIcon = () => {
    const trend = getFeedbackTrend();
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-success-600" />;
      case 'declining':
        return <AlertCircle className="h-4 w-4 text-danger-600" />;
      default:
        return <Clock className="h-4 w-4 text-warning-600" />;
    }
  };

  const getTrendText = () => {
    const trend = getFeedbackTrend();
    switch (trend) {
      case 'improving':
        return 'Feedback quality is improving';
      case 'declining':
        return 'Feedback quality needs attention';
      default:
        return 'Feedback quality is stable';
    }
  };

  const stats = [
    {
      name: 'Total Feedback',
      value: dashboardData.total_feedback,
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Team Members',
      value: dashboardData.team_size,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Pending Requests',
      value: dashboardData.feedback_requests.length,
      icon: Bell,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      name: 'Positive Feedback',
      value: dashboardData.sentiment_counts.positive,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            <FileText className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.bgColor} rounded-md p-3`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feedback Trends */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Feedback Trends</h3>
          {getTrendIcon()}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center justify-between p-4 bg-success-50 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-success-600 mr-2" />
              <div>
                <span className="text-sm font-medium text-success-800">Positive</span>
                <p className="text-xs text-success-600">
                  {dashboardData.total_feedback > 0 
                    ? `${((dashboardData.sentiment_counts.positive / dashboardData.total_feedback) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </p>
              </div>
            </div>
            <span className="text-lg font-bold text-success-900">
              {dashboardData.sentiment_counts.positive}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-warning-50 rounded-lg">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-warning-600 mr-2" />
              <div>
                <span className="text-sm font-medium text-warning-800">Neutral</span>
                <p className="text-xs text-warning-600">
                  {dashboardData.total_feedback > 0 
                    ? `${((dashboardData.sentiment_counts.neutral / dashboardData.total_feedback) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </p>
              </div>
            </div>
            <span className="text-lg font-bold text-warning-900">
              {dashboardData.sentiment_counts.neutral}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-danger-50 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-danger-600 mr-2" />
              <div>
                <span className="text-sm font-medium text-danger-800">Negative</span>
                <p className="text-xs text-danger-600">
                  {dashboardData.total_feedback > 0 
                    ? `${((dashboardData.sentiment_counts.negative / dashboardData.total_feedback) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </p>
              </div>
            </div>
            <span className="text-lg font-bold text-danger-900">
              {dashboardData.sentiment_counts.negative}
            </span>
          </div>
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            {getTrendIcon()}
            <span className="ml-2 text-sm text-gray-700">{getTrendText()}</span>
          </div>
        </div>
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Feedback */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Feedback</h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          {dashboardData.recent_feedback.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No feedback yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                {dashboardData.role === 'manager' 
                  ? 'Start giving feedback to your team members.'
                  : 'You haven\'t received any feedback yet.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardData.recent_feedback.map((feedback: Feedback) => (
                <div key={feedback.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {dashboardData.role === 'manager' 
                            ? `To: ${feedback.receiver_name}`
                            : `From: ${feedback.giver_name}`
                          }
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSentimentColor(feedback.sentiment)}`}>
                          {getSentimentIcon(feedback.sentiment)}
                          <span className="ml-1 capitalize">{feedback.sentiment}</span>
                        </span>
                        {feedback.acknowledged && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Acknowledged
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            <strong className="text-gray-900">Strengths:</strong> {feedback.strengths}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            <strong className="text-gray-900">Areas to improve:</strong> {feedback.areas_to_improve}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 text-xs text-gray-500 flex flex-col items-end">
                      <span>{new Date(feedback.created_at).toLocaleDateString()}</span>
                      <span>{new Date(feedback.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-center pt-2">
                <button 
                  onClick={() => navigate('/feedback')}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center justify-center w-full"
                >
                  View All Feedback
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
            <Bell className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {notifications?.slice(0, 5).map((notification: any) => (
              <div key={notification.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          {dashboardData.role === 'manager' && (
            <button 
              onClick={() => navigate('/feedback')}
              className="w-full btn-primary text-left"
            >
              <Plus className="h-4 w-4 mr-2 inline" />
              Give New Feedback
            </button>
          )}
          <button 
            onClick={() => navigate('/feedback')}
            className="w-full btn-secondary text-left"
          >
            <BarChart3 className="h-4 w-4 mr-2 inline" />
            View Detailed Analytics
          </button>
          {dashboardData.role === 'manager' && (
            <button 
              onClick={() => navigate('/team')}
              className="w-full btn-secondary text-left"
            >
              <Users className="h-4 w-4 mr-2 inline" />
              Manage Team
            </button>
          )}
          <button className="w-full btn-secondary text-left">
            <Target className="h-4 w-4 mr-2 inline" />
            Set Goals
          </button>
        </div>
      </div>

      {/* Feedback Requests */}
      {dashboardData?.feedback_requests?.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Pending Feedback Requests
            </h3>
            <div className="space-y-4">
              {dashboardData.feedback_requests.map((request: FeedbackRequest) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {request.requester_name} requests feedback
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {request.message}
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        {request.tags?.map((tag: string) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                        Provide Feedback
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 