export interface User {
  id: number;
  username: string;
  email: string;
  role: 'manager' | 'employee';
  manager_id?: number;
  created_at: string;
  team_members?: User[];
}

export interface EnhancedTeamMember extends User {
  feedback_count: number;
  acknowledged_count: number;
  sentiment_counts: {
    positive: number;
    neutral: number;
    negative: number;
  };
  recent_feedback: Feedback[];
  last_feedback_date?: string;
  acknowledgment_rate: number;
}

export interface Feedback {
  id: number;
  giver_id: number;
  receiver_id: number;
  giver_name?: string;
  receiver_name?: string;
  strengths: string;
  areas_to_improve: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  acknowledged: boolean;
  acknowledged_at?: string;
  created_at: string;
  updated_at: string;
}

export interface FeedbackRequest {
  id: number;
  requester_id: number;
  requester_name: string;
  receiver_id: number;
  message: string;
  tags?: string[];
  priority?: string;
  due_date?: string;
  created_at: string;
}

export interface DashboardData {
  role: 'manager' | 'employee';
  total_feedback: number;
  sentiment_counts: {
    positive: number;
    neutral: number;
    negative: number;
  };
  recent_feedback: Feedback[];
  team_size?: number;
  team_members?: User[];
  acknowledged_count?: number;
  feedback_requests: FeedbackRequest[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: 'manager' | 'employee';
  manager_id?: number;
}

export interface CreateFeedbackData {
  receiver_id: number;
  strengths: string;
  areas_to_improve: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface UpdateFeedbackData {
  strengths?: string;
  areas_to_improve?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
} 