import React from 'react';
import { useQuery } from 'react-query';
import { Users, Mail, Calendar, Award, TrendingUp } from 'lucide-react';
import { userAPI } from '../services/api';

const TeamPage: React.FC = () => {
  const { data: teamMembers, isLoading, error } = useQuery('team-members', userAPI.getAll);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Error loading team</div>
        <p className="text-gray-600">Please try again later.</p>
      </div>
    );
  }

  const getPerformanceScore = (member: any) => {
    // Calculate performance score based on feedback sentiment
    if (!member.feedback_received || member.feedback_received.length === 0) {
      return 'N/A';
    }
    
    const positiveCount = member.feedback_received.filter((f: any) => f.sentiment === 'positive').length;
    const totalCount = member.feedback_received.length;
    const score = Math.round((positiveCount / totalCount) * 100);
    
    return `${score}%`;
  };

  // Group team members by manager
  const teamsByManager: { [manager: string]: any[] } = {};
  if (teamMembers) {
    teamMembers.forEach((member: any) => {
      const managerName = member.manager && member.manager.username ? member.manager.username : (member.role === 'manager' ? member.username : 'No Manager');
      if (!teamsByManager[managerName]) teamsByManager[managerName] = [];
      teamsByManager[managerName].push(member);
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Team</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage your team members
        </p>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Members
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {teamMembers?.length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    High Performers
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {teamMembers?.filter((m: any) => getPerformanceScore(m) !== 'N/A' && parseInt(getPerformanceScore(m)) >= 80).length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Avg Performance
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {(() => {
                      const scores = teamMembers?.map((m: any) => {
                        const score = getPerformanceScore(m);
                        return score === 'N/A' ? 0 : parseInt(score);
                      }).filter((s: number) => s > 0) || [];
                      
                      if (scores.length === 0) return 'N/A';
                      const avg = Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length);
                      return `${avg}%`;
                    })()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Members
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {teamMembers?.filter((m: any) => m.feedback_received && m.feedback_received.length > 0).length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="space-y-8">
        {Object.entries(teamsByManager).map(([manager, members]) => (
          <div key={manager} className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-blue-700 mb-4">Team: {manager}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member: any) => (
                <div key={member.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{member.username}</h4>
                      <p className="text-sm text-gray-500 capitalize">{member.role}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.role === 'manager' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>{member.role}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600"><Mail className="w-4 h-4 mr-2" />{member.email}</div>
                    <div className="flex items-center text-sm text-gray-600"><Calendar className="w-4 h-4 mr-2" />Joined {new Date(member.created_at).toLocaleDateString()}</div>
                    <div className="flex items-center text-sm text-gray-600"><Award className="w-4 h-4 mr-2" />Performance: {getPerformanceScore(member)}</div>
                    <div className="flex items-center text-sm text-gray-600"><TrendingUp className="w-4 h-4 mr-2" />Feedback Given: {member.feedback_given ? member.feedback_given.length : 0}</div>
                    <div className="flex items-center text-sm text-gray-600"><TrendingUp className="w-4 h-4 mr-2" />Feedback Received: {member.feedback_received ? member.feedback_received.length : 0}</div>
                    {member.tags && member.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {member.tags.map((tag: string, idx: number) => (
                          <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPage; 