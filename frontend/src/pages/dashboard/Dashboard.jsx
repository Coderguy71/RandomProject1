import React from 'react';

const Dashboard = () => {
  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-100 mb-2">Welcome Back!</h1>
        <p className="text-dark-400">Ready to continue your SAT Math journey?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 bg-primary-600/10 rounded-lg">
                <svg className="h-6 w-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-dark-400">Problems Solved</p>
                <p className="text-2xl font-semibold text-dark-100">127</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 bg-green-600/10 rounded-lg">
                <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-dark-400">Accuracy Rate</p>
                <p className="text-2xl font-semibold text-dark-100">78%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 bg-orange-600/10 rounded-lg">
                <svg className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-dark-400">Current Streak</p>
                <p className="text-2xl font-semibold text-dark-100">12 days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 bg-purple-600/10 rounded-lg">
                <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-dark-400">Village Level</p>
                <p className="text-2xl font-semibold text-dark-100">5</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-dark-100">Quick Start</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 gap-4">
              <button className="btn-primary">
                Continue Learning
              </button>
              <button className="btn-secondary">
                Practice Problems
              </button>
              <button className="btn-secondary">
                View Village
              </button>
              <button className="btn-secondary">
                Check Progress
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-dark-100">Recent Activity</h2>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-dark-300">Completed Algebra practice</span>
                </div>
                <span className="text-xs text-dark-400">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-primary-400 rounded-full"></div>
                  <span className="text-sm text-dark-300">Earned new decoration</span>
                </div>
                <span className="text-xs text-dark-400">5 hours ago</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-orange-400 rounded-full"></div>
                  <span className="text-sm text-dark-300">7 day streak achieved!</span>
                </div>
                <span className="text-xs text-dark-400">Yesterday</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Path Preview */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-dark-100">Your Learning Path</h2>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-dark-800 rounded-lg border-l-4 border-green-500">
              <div>
                <h3 className="font-medium text-dark-100">Heart of Algebra</h3>
                <p className="text-sm text-dark-400">Linear equations and systems</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-400">Proficient</p>
                <p className="text-xs text-dark-400">85% mastery</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-dark-800 rounded-lg border-l-4 border-yellow-500">
              <div>
                <h3 className="font-medium text-dark-100">Problem Solving</h3>
                <p className="text-sm text-dark-400">Ratios, percentages, and data</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-yellow-400">In Progress</p>
                <p className="text-xs text-dark-400">62% mastery</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-dark-800 rounded-lg border-l-4 border-gray-500">
              <div>
                <h3 className="font-medium text-dark-100">Passport to Math</h3>
                <p className="text-sm text-dark-400">Advanced topics and complex problems</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-400">Not Started</p>
                <p className="text-xs text-dark-400">0% mastery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;