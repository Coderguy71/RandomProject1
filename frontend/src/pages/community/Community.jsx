import React from 'react';

const Community = () => {
  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-100 mb-2">Community</h1>
        <p className="text-dark-400">Connect with fellow SAT Math learners</p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-primary-400 mb-2">2,847</div>
            <div className="text-sm text-dark-400">Active Learners</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">156</div>
            <div className="text-sm text-dark-400">Online Now</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">89%</div>
            <div className="text-sm text-dark-400">Score Improvement</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Discussion Board */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-dark-100">Recent Discussions</h2>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="p-4 bg-dark-800 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        JD
                      </div>
                      <div>
                        <div className="font-medium text-dark-100">Jane Doe</div>
                        <div className="text-xs text-dark-400">2 hours ago</div>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-primary-600/20 text-primary-400 rounded">Question</span>
                  </div>
                  <h3 className="font-medium text-dark-100 mb-2">Help with linear equations?</h3>
                  <p className="text-sm text-dark-300 mb-3">
                    I'm struggling with systems of equations. Can someone explain the substitution method?
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-dark-400">
                    <button className="hover:text-primary-400">👍 12</button>
                    <button className="hover:text-primary-400">💬 8 replies</button>
                    <button className="hover:text-primary-400">🔖 Save</button>
                  </div>
                </div>

                <div className="p-4 bg-dark-800 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        AS
                      </div>
                      <div>
                        <div className="font-medium text-dark-100">Alex Smith</div>
                        <div className="text-xs text-dark-400">5 hours ago</div>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-600/20 text-green-400 rounded">Success</span>
                  </div>
                  <h3 className="font-medium text-dark-100 mb-2">Finally hit 750+ practice score!</h3>
                  <p className="text-sm text-dark-300 mb-3">
                    After 3 months of consistent practice, I'm finally seeing real improvement. The key was daily practice!
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-dark-400">
                    <button className="hover:text-primary-400">👍 45</button>
                    <button className="hover:text-primary-400">💬 23 replies</button>
                    <button className="hover:text-primary-400">🔖 Save</button>
                  </div>
                </div>

                <div className="p-4 bg-dark-800 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        MJ
                      </div>
                      <div>
                        <div className="font-medium text-dark-100">Mike Johnson</div>
                        <div className="text-xs text-dark-400">1 day ago</div>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded">Tips</span>
                  </div>
                  <h3 className="font-medium text-dark-100 mb-2">Best geometry formulas to memorize</h3>
                  <p className="text-sm text-dark-300 mb-3">
                    Here's my list of essential geometry formulas that always appear on the SAT...
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-dark-400">
                    <button className="hover:text-primary-400">👍 67</button>
                    <button className="hover:text-primary-400">💬 15 replies</button>
                    <button className="hover:text-primary-400">🔖 Save</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Study Groups */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-dark-100">Active Study Groups</h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-dark-800 rounded-lg border border-dark-600 hover:border-primary-500 cursor-pointer transition-colors">
                  <h3 className="font-medium text-dark-100 mb-2">Algebra Warriors</h3>
                  <p className="text-sm text-dark-400 mb-3">Master linear equations together</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-dark-400">23 members</span>
                    <button className="text-xs btn-primary py-1 px-2">Join</button>
                  </div>
                </div>

                <div className="p-4 bg-dark-800 rounded-lg border border-dark-600 hover:border-primary-500 cursor-pointer transition-colors">
                  <h3 className="font-medium text-dark-100 mb-2">Geometry Masters</h3>
                  <p className="text-sm text-dark-400 mb-3">Shapes, angles, and proofs</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-dark-400">18 members</span>
                    <button className="text-xs btn-primary py-1 px-2">Join</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Leaderboard */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-dark-100">Weekly Leaderboard</h2>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-dark-100">Sarah Chen</div>
                    <div className="text-xs text-dark-400">2,450 XP</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-dark-100">David Kim</div>
                    <div className="text-xs text-dark-400">2,320 XP</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-dark-100">Emma Wilson</div>
                    <div className="text-xs text-dark-400">2,180 XP</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-dark-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      12
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-dark-100">You</div>
                      <div className="text-xs text-dark-400">1,250 XP</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-dark-100">Upcoming Events</h2>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <div className="p-3 bg-dark-800 rounded-lg">
                  <div className="font-medium text-dark-100 text-sm">Live Study Session</div>
                  <div className="text-xs text-dark-400">Today, 4:00 PM</div>
                  <div className="text-xs text-primary-400 mt-1">Algebra Focus</div>
                </div>

                <div className="p-3 bg-dark-800 rounded-lg">
                  <div className="font-medium text-dark-100 text-sm">Practice Challenge</div>
                  <div className="text-xs text-dark-400">Tomorrow, All Day</div>
                  <div className="text-xs text-primary-400 mt-1">Geometry Problems</div>
                </div>

                <div className="p-3 bg-dark-800 rounded-lg">
                  <div className="font-medium text-dark-100 text-sm">Guest Speaker</div>
                  <div className="text-xs text-dark-400">Friday, 6:00 PM</div>
                  <div className="text-xs text-primary-400 mt-1">SAT Test Strategies</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;