import React from 'react';

const Practice = () => {
  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-100 mb-2">Practice Problems</h1>
        <p className="text-dark-400">Master SAT Math with targeted practice problems</p>
      </div>

      {/* Topic Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-dark-100">Choose a Topic</h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-dark-800 rounded-lg border border-dark-600 hover:border-primary-500 cursor-pointer transition-colors">
                  <h3 className="font-medium text-dark-100 mb-1">Heart of Algebra</h3>
                  <p className="text-sm text-dark-400 mb-3">Linear equations and systems</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-dark-400">42 problems</span>
                    <span className="text-xs px-2 py-1 bg-green-600/20 text-green-400 rounded">85% mastery</span>
                  </div>
                </div>

                <div className="p-4 bg-dark-800 rounded-lg border border-dark-600 hover:border-primary-500 cursor-pointer transition-colors">
                  <h3 className="font-medium text-dark-100 mb-1">Problem Solving</h3>
                  <p className="text-sm text-dark-400 mb-3">Ratios, percentages, data</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-dark-400">38 problems</span>
                    <span className="text-xs px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded">62% mastery</span>
                  </div>
                </div>

                <div className="p-4 bg-dark-800 rounded-lg border border-dark-600 hover:border-primary-500 cursor-pointer transition-colors">
                  <h3 className="font-medium text-dark-100 mb-1">Passport to Math</h3>
                  <p className="text-sm text-dark-400 mb-3">Advanced topics</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-dark-400">35 problems</span>
                    <span className="text-xs px-2 py-1 bg-gray-600/20 text-gray-400 rounded">Not started</span>
                  </div>
                </div>

                <div className="p-4 bg-dark-800 rounded-lg border border-dark-600 hover:border-primary-500 cursor-pointer transition-colors">
                  <h3 className="font-medium text-dark-100 mb-1">Geometry</h3>
                  <p className="text-sm text-dark-400 mb-3">Shapes, angles, and measurements</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-dark-400">40 problems</span>
                    <span className="text-xs px-2 py-1 bg-green-600/20 text-green-400 rounded">78% mastery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Practice Settings */}
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-dark-100">Practice Mode</h2>
            </div>
            <div className="card-body space-y-4">
              <button className="btn-primary w-full">
                Guided Practice
              </button>
              <button className="btn-secondary w-full">
                Timed Practice
              </button>
              <button className="btn-secondary w-full">
                Review Mistakes
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-dark-100">Difficulty</h2>
            </div>
            <div className="card-body">
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="radio" name="difficulty" className="mr-2" />
                  <span className="text-sm text-dark-300">Easy</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="difficulty" className="mr-2" defaultChecked />
                  <span className="text-sm text-dark-300">Medium</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="difficulty" className="mr-2" />
                  <span className="text-sm text-dark-300">Hard</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="difficulty" className="mr-2" />
                  <span className="text-sm text-dark-300">Mixed</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Problems */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-dark-100">Recent Problems</h2>
        </div>
        <div className="card-body">
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-dark-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-dark-400">Select a topic to start practicing</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;