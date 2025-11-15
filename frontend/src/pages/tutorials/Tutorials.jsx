import React from 'react';

const Tutorials = () => {
  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-100 mb-2">Tutorials</h1>
        <p className="text-dark-400">Learn SAT Math concepts step by step</p>
      </div>

      {/* Featured Tutorial */}
      <div className="card mb-8">
        <div className="card-body">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div>
              <span className="text-xs px-2 py-1 bg-primary-600/20 text-primary-400 rounded mb-2 inline-block">Featured</span>
              <h2 className="text-2xl font-bold text-dark-100 mb-3">Master Linear Equations</h2>
              <p className="text-dark-300 mb-4">
                Complete guide to solving linear equations and systems, from basic concepts to advanced techniques.
              </p>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-sm text-dark-400">45 min</span>
                <span className="text-sm text-dark-400">•</span>
                <span className="text-sm text-dark-400">Intermediate</span>
                <span className="text-sm text-dark-400">•</span>
                <span className="text-sm text-dark-400">1.2k views</span>
              </div>
              <button className="btn-primary">Start Learning</button>
            </div>
            <div className="aspect-video bg-dark-800 rounded-lg flex items-center justify-center">
              <svg className="h-16 w-16 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial Categories */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-dark-100">Browse by Topic</h2>
          <div className="flex space-x-2">
            <button className="btn-outline text-sm">All</button>
            <button className="btn-secondary text-sm">Beginner</button>
            <button className="btn-secondary text-sm">Intermediate</button>
            <button className="btn-secondary text-sm">Advanced</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Heart of Algebra */}
          <div className="card">
            <div className="card-body">
              <div className="aspect-video bg-dark-800 rounded-lg mb-4 flex items-center justify-center">
                <svg className="h-12 w-12 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-dark-100 mb-2">Heart of Algebra</h3>
              <p className="text-sm text-dark-400 mb-4">Linear equations, inequalities, and systems</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-dark-400">12 tutorials</span>
                <button className="text-primary-400 hover:text-primary-300 text-sm">View All →</button>
              </div>
            </div>
          </div>

          {/* Problem Solving */}
          <div className="card">
            <div className="card-body">
              <div className="aspect-video bg-dark-800 rounded-lg mb-4 flex items-center justify-center">
                <svg className="h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="font-semibold text-dark-100 mb-2">Problem Solving</h3>
              <p className="text-sm text-dark-400 mb-4">Ratios, percentages, and data analysis</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-dark-400">10 tutorials</span>
                <button className="text-primary-400 hover:text-primary-300 text-sm">View All →</button>
              </div>
            </div>
          </div>

          {/* Passport to Math */}
          <div className="card">
            <div className="card-body">
              <div className="aspect-video bg-dark-800 rounded-lg mb-4 flex items-center justify-center">
                <svg className="h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold text-dark-100 mb-2">Passport to Math</h3>
              <p className="text-sm text-dark-400 mb-4">Advanced topics and complex problems</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-dark-400">8 tutorials</span>
                <button className="text-primary-400 hover:text-primary-300 text-sm">View All →</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tutorials */}
      <div className="card mb-8">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-dark-100">Recent Tutorials</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex space-x-4">
              <div className="w-24 h-16 bg-dark-800 rounded-lg flex-shrink-0 flex items-center justify-center">
                <svg className="h-8 w-8 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-dark-100 mb-1">Solving Systems of Equations</h3>
                <p className="text-sm text-dark-400 mb-2">Learn substitution and elimination methods</p>
                <div className="flex items-center space-x-3 text-xs text-dark-400">
                  <span>25 min</span>
                  <span>•</span>
                  <span>Beginner</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="w-24 h-16 bg-dark-800 rounded-lg flex-shrink-0 flex items-center justify-center">
                <svg className="h-8 w-8 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-dark-100 mb-1">Quadratic Equations Guide</h3>
                <p className="text-sm text-dark-400 mb-2">Factoring, completing the square, and formulas</p>
                <div className="flex items-center space-x-3 text-xs text-dark-400">
                  <span>35 min</span>
                  <span>•</span>
                  <span>Intermediate</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="w-24 h-16 bg-dark-800 rounded-lg flex-shrink-0 flex items-center justify-center">
                <svg className="h-8 w-8 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-dark-100 mb-1">Geometry: Triangles & Angles</h3>
                <p className="text-sm text-dark-400 mb-2">Essential theorems and problem-solving</p>
                <div className="flex items-center space-x-3 text-xs text-dark-400">
                  <span>30 min</span>
                  <span>•</span>
                  <span>Beginner</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="w-24 h-16 bg-dark-800 rounded-lg flex-shrink-0 flex items-center justify-center">
                <svg className="h-8 w-8 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-dark-100 mb-1">Data Analysis & Statistics</h3>
                <p className="text-sm text-dark-400 mb-2">Mean, median, mode, and data interpretation</p>
                <div className="flex items-center space-x-3 text-xs text-dark-400">
                  <span>20 min</span>
                  <span>•</span>
                  <span>Beginner</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Path */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-dark-100">Your Learning Path</h2>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-dark-800 rounded-lg">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-medium">
                ✓
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-dark-100">Basic Algebra</h3>
                <p className="text-sm text-dark-400">Completed • 4 tutorials</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-dark-800 rounded-lg border-l-4 border-primary-500">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-dark-100">Linear Equations</h3>
                <p className="text-sm text-dark-400">In Progress • 2 of 6 tutorials completed</p>
              </div>
              <button className="btn-primary text-sm">Continue</button>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-dark-800 rounded-lg opacity-50">
              <div className="w-10 h-10 bg-dark-600 rounded-full flex items-center justify-center text-white font-medium">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-dark-100">Advanced Topics</h3>
                <p className="text-sm text-dark-400">Locked • Complete previous modules first</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutorials;