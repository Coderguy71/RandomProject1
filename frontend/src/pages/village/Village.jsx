import React from 'react';

const Village = () => {
  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-100 mb-2">Your Village</h1>
        <p className="text-dark-400">Build and customize your learning village</p>
      </div>

      {/* Village Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-primary-400 mb-1">Level 5</div>
            <div className="text-sm text-dark-400">Village Level</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">85%</div>
            <div className="text-sm text-dark-400">Health</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">12</div>
            <div className="text-sm text-dark-400">Day Streak</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">8</div>
            <div className="text-sm text-dark-400">Decorations</div>
          </div>
        </div>
      </div>

      {/* Main Village Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Village Display */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-dark-100">Village View</h2>
            </div>
            <div className="card-body">
              <div className="bg-dark-800 rounded-lg p-8 text-center">
                <div className="mb-4">
                  <svg className="mx-auto h-24 w-24 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-dark-100 mb-2">Your Village</h3>
                <p className="text-dark-400 mb-4">A thriving learning community</p>
                
                {/* Village Grid */}
                <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className="aspect-square bg-dark-700 rounded border border-dark-600 hover:border-primary-500 cursor-pointer transition-colors"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resources & Shop */}
        <div className="space-y-6">
          {/* Resources */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-dark-100">Resources</h2>
            </div>
            <div className="card-body space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">G</span>
                  </div>
                  <span className="text-sm text-dark-300">Gold</span>
                </div>
                <span className="font-semibold text-dark-100">1,250</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">G</span>
                  </div>
                  <span className="text-sm text-dark-300">Gems</span>
                </div>
                <span className="font-semibold text-dark-100">25</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">W</span>
                  </div>
                  <span className="text-sm text-dark-300">Wood</span>
                </div>
                <span className="font-semibold text-dark-100">180</span>
              </div>
            </div>
          </div>

          {/* Decorations Shop */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-dark-100">Decorations Shop</h2>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-dark-800 rounded">
                  <div>
                    <h4 className="text-sm font-medium text-dark-100">Tree</h4>
                    <p className="text-xs text-dark-400">100 Gold</p>
                  </div>
                  <button className="btn-outline text-xs py-1 px-2">Buy</button>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-dark-800 rounded">
                  <div>
                    <h4 className="text-sm font-medium text-dark-100">House</h4>
                    <p className="text-xs text-dark-400">500 Gold</p>
                  </div>
                  <button className="btn-outline text-xs py-1 px-2">Buy</button>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-dark-800 rounded">
                  <div>
                    <h4 className="text-sm font-medium text-dark-100">Fountain</h4>
                    <p className="text-xs text-dark-400">10 Gems</p>
                  </div>
                  <button className="btn-outline text-xs py-1 px-2">Buy</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="mt-8">
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-dark-100">Recent Milestones</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-dark-800 rounded-lg">
                <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-dark-100">First Steps</h3>
                <p className="text-xs text-dark-400">Complete 10 problems</p>
              </div>
              
              <div className="text-center p-4 bg-dark-800 rounded-lg">
                <div className="w-12 h-12 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-dark-100">Week Warrior</h3>
                <p className="text-xs text-dark-400">7 day streak</p>
              </div>
              
              <div className="text-center p-4 bg-dark-800 rounded-lg opacity-50">
                <div className="w-12 h-12 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="font-medium text-dark-100">Master Mind</h3>
                <p className="text-xs text-dark-400">100 problems solved</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Village;