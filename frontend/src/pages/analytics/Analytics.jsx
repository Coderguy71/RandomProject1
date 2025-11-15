import React from 'react';

const Analytics = () => {
  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-100 mb-2">Analytics Dashboard</h1>
        <p className="text-dark-400">Track your progress and performance</p>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-dark-100">Performance Trend</h2>
          </div>
          <div className="card-body">
            <div className="h-64 bg-dark-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-dark-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-dark-400">Performance chart will be displayed here</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-dark-100">Topic Distribution</h2>
          </div>
          <div className="card-body">
            <div className="h-64 bg-dark-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-dark-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                <p className="text-dark-400">Topic distribution chart will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-primary-400 mb-2">127</div>
            <div className="text-sm text-dark-400">Total Problems</div>
            <div className="text-xs text-green-400 mt-1">+12 this week</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">78%</div>
            <div className="text-sm text-dark-400">Overall Accuracy</div>
            <div className="text-xs text-green-400 mt-1">+3% this week</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">2m 45s</div>
            <div className="text-sm text-dark-400">Avg. Time per Problem</div>
            <div className="text-xs text-red-400 mt-1">+15s this week</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">5</div>
            <div className="text-sm text-dark-400">Current Streak</div>
            <div className="text-xs text-green-400 mt-1">Personal best!</div>
          </div>
        </div>
      </div>

      {/* Topic Breakdown */}
      <div className="card mb-8">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-dark-100">Topic Performance</h2>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-dark-100">Heart of Algebra</span>
                <span className="text-sm text-dark-400">85% accuracy</span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-dark-100">Problem Solving</span>
                <span className="text-sm text-dark-400">62% accuracy</span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-dark-100">Passport to Math</span>
                <span className="text-sm text-dark-400">45% accuracy</span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-dark-100">Geometry</span>
                <span className="text-sm text-dark-400">78% accuracy</span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-dark-100">Recent Practice Sessions</h2>
        </div>
        <div className="card-body">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
              <div>
                <div className="font-medium text-dark-100">Heart of Algebra Practice</div>
                <div className="text-sm text-dark-400">2 hours ago • 15 problems</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-green-400">87%</div>
                <div className="text-xs text-dark-400">accuracy</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
              <div>
                <div className="font-medium text-dark-100">Problem Solving Review</div>
                <div className="text-sm text-dark-400">Yesterday • 10 problems</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-yellow-400">70%</div>
                <div className="text-xs text-dark-400">accuracy</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
              <div>
                <div className="font-medium text-dark-100">Geometry Challenge</div>
                <div className="text-sm text-dark-400">2 days ago • 8 problems</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-green-400">92%</div>
                <div className="text-xs text-dark-400">accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;