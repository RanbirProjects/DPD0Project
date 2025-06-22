import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Plus, 
  MessageSquare, 
  Tag, 
  Eye, 
  EyeOff, 
  Download,
  Send,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { feedbackAPI, userAPI } from '../services/api';

// Simple markdown renderer component
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const renderMarkdown = (text: string) => {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div 
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content || '') }}
    />
  );
};

const FeedbackPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [commentText, setCommentText] = useState('');

  const [formData, setFormData] = useState({
    receiver_id: '',
    strengths: '',
    areas_to_improve: '',
    sentiment: 'positive',
    tags: [] as string[],
    is_anonymous: false,
  });

  const [newTag, setNewTag] = useState('');

  // Get feedback and team members
  const { data: feedbackList } = useQuery('feedback', feedbackAPI.getAll);
  const { data: teamMembers } = useQuery('team-members', feedbackAPI.getTeamMembers);

  // Submit feedback mutation
  const submitFeedbackMutation = useMutation(
    (data: any) => feedbackAPI.submit(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('feedback');
        queryClient.invalidateQueries('dashboard');
        setFormData({
          receiver_id: '',
          strengths: '',
          areas_to_improve: '',
          sentiment: 'positive',
          tags: [],
          is_anonymous: false,
        });
        setNewTag('');
        setShowForm(false);
      },
    }
  );

  // Submit comment mutation
  const submitCommentMutation = useMutation(
    ({ feedbackId, data }: { feedbackId: number; data: any }) => 
      feedbackAPI.submitComment(feedbackId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('feedback');
        setCommentText('');
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedbackMutation.mutate(formData);
  };

  const handleCommentSubmit = (feedbackId: number) => {
    if (commentText.trim()) {
      submitCommentMutation.mutate({
        feedbackId,
        data: { content: commentText }
      });
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const availableTags = [
    'communication', 'leadership', 'teamwork', 'problem-solving',
    'technical-skills', 'time-management', 'creativity', 'adaptability',
    'collaboration', 'initiative', 'quality', 'efficiency'
  ];

  const exportPDF = (feedbackId: number) => {
    feedbackAPI.exportPDF(feedbackId).then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `feedback-${feedbackId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Feedback</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Give Feedback
        </button>
      </div>

      {/* Feedback Form */}
      {showForm && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Give Feedback</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Receiver Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Give feedback to
                </label>
                <select
                  value={formData.receiver_id}
                  onChange={(e) => setFormData({ ...formData, receiver_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a team member</option>
                  {teamMembers?.map((member: any) => (
                    <option key={member.id} value={member.id}>
                      {member.username} ({member.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Strengths with Markdown support */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Strengths (Markdown supported)
                </label>
                <textarea
                  value={formData.strengths}
                  onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Write about their strengths... You can use **bold**, *italic*, and `code` formatting."
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Markdown supported: **bold**, *italic*, `code`, line breaks
                </p>
              </div>

              {/* Areas to Improve with Markdown support */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Areas to Improve (Markdown supported)
                </label>
                <textarea
                  value={formData.areas_to_improve}
                  onChange={(e) => setFormData({ ...formData, areas_to_improve: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Write about areas for improvement... You can use **bold**, *italic*, and `code` formatting."
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Markdown supported: **bold**, *italic*, `code`, line breaks
                </p>
              </div>

              {/* Sentiment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sentiment
                </label>
                <select
                  value={formData.sentiment}
                  onChange={(e) => setFormData({ ...formData, sentiment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="positive">Positive</option>
                  <option value="neutral">Neutral</option>
                  <option value="negative">Negative</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                
                {/* Add new tag */}
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add a tag..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>

                {/* Selected tags */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        <Tag className="w-4 h-4 mr-1" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Available tags */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Popular tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (!formData.tags.includes(tag)) {
                            setFormData({
                              ...formData,
                              tags: [...formData.tags, tag],
                            });
                          }
                        }}
                        disabled={formData.tags.includes(tag)}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          formData.tags.includes(tag)
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Anonymous option */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={formData.is_anonymous}
                  onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="anonymous" className="ml-2 flex items-center text-sm text-gray-700">
                  {formData.is_anonymous ? (
                    <EyeOff className="w-4 h-4 mr-1" />
                  ) : (
                    <Eye className="w-4 h-4 mr-1" />
                  )}
                  Submit anonymously
                </label>
              </div>

              {/* Submit button */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitFeedbackMutation.isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitFeedbackMutation.isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Feedback</h3>
          
          <div className="space-y-6">
            {feedbackList?.map((feedback: any) => (
              <div key={feedback.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {feedback.is_anonymous ? 'Anonymous' : feedback.giver_name}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="text-sm font-medium text-gray-900">
                        {feedback.receiver_name}
                      </span>
                    </div>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        feedback.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                        feedback.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {feedback.sentiment === 'positive' ? <ThumbsUp className="w-3 h-3 mr-1" /> :
                         feedback.sentiment === 'negative' ? <ThumbsDown className="w-3 h-3 mr-1" /> :
                         <MessageSquare className="w-3 h-3 mr-1" />}
                        {feedback.sentiment}
                      </span>
                      {feedback.tags?.map((tag: string) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => exportPDF(feedback.id)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Export as PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Feedback content with markdown */}
                <div className="mb-4">
                  <div className="space-y-3">
                    {feedback.strengths && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-1">Strengths:</h5>
                        <MarkdownRenderer content={feedback.strengths} />
                      </div>
                    )}
                    {feedback.areas_to_improve && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-1">Areas to Improve:</h5>
                        <MarkdownRenderer content={feedback.areas_to_improve} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Comments */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Comments</h4>
                  
                  {/* Comment form */}
                  <div className="mb-4">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={() => handleCommentSubmit(feedback.id)}
                        disabled={!commentText.trim() || submitCommentMutation.isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Comments list */}
                  <div className="space-y-3">
                    {feedback.comments?.map((comment: any) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-medium text-gray-900">
                            {comment.author_name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mt-1">
                          <MarkdownRenderer content={comment.content} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage; 