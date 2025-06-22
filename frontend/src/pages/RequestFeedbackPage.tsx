import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Send, Tag, Eye, EyeOff, User, Users } from 'lucide-react';
import { feedbackAPI, userAPI } from '../services/api';

const RequestFeedbackPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    receiver_id: '',
    message: '',
    tags: [] as string[],
    is_anonymous: false,
    priority: 'normal',
    due_date: '',
  });

  const [newTag, setNewTag] = useState('');

  // Get team members
  const { data: teamMembers } = useQuery('team-members', feedbackAPI.getTeamMembers);

  // Request feedback mutation
  const requestFeedbackMutation = useMutation(
    (data: any) => feedbackAPI.requestFeedback(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('dashboard');
        queryClient.invalidateQueries('feedback-requests');
        setFormData({
          receiver_id: '',
          message: '',
          tags: [],
          is_anonymous: false,
          priority: 'normal',
          due_date: '',
        });
        setNewTag('');
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestFeedbackMutation.mutate(formData);
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const availableTags = [
    'communication', 'leadership', 'teamwork', 'problem-solving',
    'technical-skills', 'time-management', 'creativity', 'adaptability',
    'collaboration', 'initiative', 'quality', 'efficiency'
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Request Feedback
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Receiver Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request feedback from
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

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (optional)
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Explain what kind of feedback you're looking for..."
              />
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
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            {/* Options */}
            <div className="space-y-4">
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
                  Request anonymous feedback
                </label>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Due date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due date (optional)
                </label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Submit button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={requestFeedbackMutation.isLoading || !formData.receiver_id}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {requestFeedbackMutation.isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Send Request
              </button>
            </div>
          </form>

          {requestFeedbackMutation.isSuccess && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                Feedback request sent successfully!
              </p>
            </div>
          )}

          {requestFeedbackMutation.isError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">
                Error sending feedback request. Please try again.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestFeedbackPage; 