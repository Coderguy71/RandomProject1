import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'settings', label: 'Settings' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'statistics', label: 'Statistics' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-100 mb-2">Profile</h1>
        <p className="text-dark-400">Manage your account and track your progress</p>
      </div>

      {/* Profile Card */}
      <div className="card mb-8">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user?.firstName?.[0] || user?.email?.[0] || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-dark-100 mb-1">
                {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || 'User'}
              </h2>
              <p className="text-dark-400 mb-4">{user?.email}</p>
              
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm">
                <div>
                  <span className="text-dark-400">Member since:</span>
                  <span className="text-dark-100 ml-1">November 2024</span>
                </div>
                <div>
                  <span className="text-dark-400">Level:</span>
                  <span className="text-primary-400 ml-1">5</span>
                </div>
                <div>
                  <span className="text-dark-400">Total XP:</span>
                  <span className="text-dark-100 ml-1">2,450</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn-primary"
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
              <button className="btn-secondary">
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-dark-700 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-dark-400 hover:text-dark-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-dark-100">Learning Progress</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-dark-100">Overall Progress</span>
                        <span className="text-sm text-dark-400">68%</span>
                      </div>
                      <div className="w-full bg-dark-700 rounded-full h-2">
                        <div className="bg-primary-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-dark-800 rounded-lg">
                        <div className="text-2xl font-bold text-primary-400">127</div>
                        <div className="text-sm text-dark-400">Problems Solved</div>
                      </div>
                      <div className="text-center p-4 bg-dark-800 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">78%</div>
                        <div className="text-sm text-dark-400">Accuracy Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-dark-100">Recent Achievements</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-600/20 rounded-full flex items-center justify-center">
                        🏆
                      </div>
                      <div>
                        <div className="font-medium text-dark-100">Week Warrior</div>
                        <div className="text-sm text-dark-400">7 day streak achieved</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-600/20 rounded-full flex items-center justify-center">
                        🎯
                      </div>
                      <div>
                        <div className="font-medium text-dark-100">Sharp Shooter</div>
                        <div className="text-sm text-dark-400">90% accuracy in 10 problems</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-600/20 rounded-full flex items-center justify-center">
                        📚
                      </div>
                      <div>
                        <div className="font-medium text-dark-100">Dedicated Learner</div>
                        <div className="text-sm text-dark-400">100 problems completed</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-dark-100">Study Goals</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-dark-300">Daily Problems</span>
                      <span className="text-sm text-primary-400">5/10</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-dark-300">Weekly Target</span>
                      <span className="text-sm text-green-400">45/50</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-dark-300">Monthly Goal</span>
                      <span className="text-sm text-yellow-400">180/200</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-dark-100">Learning Streaks</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-400">12</div>
                      <div className="text-sm text-dark-400">Current Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-semibold text-dark-100">18</div>
                      <div className="text-sm text-dark-400">Longest Streak</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-dark-100">Account Settings</h3>
              </div>
              <div className="card-body space-y-6">
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">Display Name</label>
                  <input
                    type="text"
                    defaultValue={user?.firstName || ''}
                    className="input-field"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">Email Address</label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    className="input-field"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">Time Zone</label>
                  <select className="input-field">
                    <option>UTC-5:00 Eastern Time</option>
                    <option>UTC-6:00 Central Time</option>
                    <option>UTC-7:00 Mountain Time</option>
                    <option>UTC-8:00 Pacific Time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">Notification Preferences</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm text-dark-300">Email notifications for practice reminders</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm text-dark-300">Achievement notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-dark-300">Weekly progress reports</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-dark-700">
                  <button className="btn-primary mr-3">Save Changes</button>
                  <button className="btn-secondary">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div>
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-dark-100">All Achievements</h3>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'First Steps', desc: 'Complete your first problem', icon: '👟', unlocked: true },
                    { name: 'Week Warrior', desc: '7 day streak', icon: '🔥', unlocked: true },
                    { name: 'Problem Solver', desc: 'Solve 50 problems', icon: '✅', unlocked: true },
                    { name: 'Master Mind', desc: 'Solve 100 problems', icon: '🧠', unlocked: true },
                    { name: 'Speed Demon', desc: 'Solve 10 problems under 2 minutes', icon: '⚡', unlocked: false },
                    { name: 'Perfect Score', desc: '100% accuracy in a session', icon: '💯', unlocked: false },
                  ].map((achievement, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        achievement.unlocked
                          ? 'bg-dark-800 border-primary-500/30'
                          : 'bg-dark-900 border-dark-700 opacity-50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{achievement.icon}</div>
                      <h4 className="font-medium text-dark-100 mb-1">{achievement.name}</h4>
                      <p className="text-sm text-dark-400">{achievement.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'statistics' && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-dark-100">Performance Metrics</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-dark-300">Total Problems Attempted</span>
                      <span className="font-semibold text-dark-100">162</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-300">Correct Answers</span>
                      <span className="font-semibold text-green-400">127</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-300">Average Time per Problem</span>
                      <span className="font-semibold text-dark-100">2m 45s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-300">Best Streak</span>
                      <span className="font-semibold text-orange-400">18 days</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-dark-100">Topic Breakdown</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-dark-300">Heart of Algebra</span>
                        <span className="text-dark-100">85%</span>
                      </div>
                      <div className="w-full bg-dark-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-dark-300">Problem Solving</span>
                        <span className="text-dark-100">62%</span>
                      </div>
                      <div className="w-full bg-dark-700 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-dark-300">Geometry</span>
                        <span className="text-dark-100">78%</span>
                      </div>
                      <div className="w-full bg-dark-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;