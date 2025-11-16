import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { topicsAPI } from '../../services/apiServices';
import { Card, Button, Badge, Spinner } from '../ui';

const SubtopicSelection = () => {
  const navigate = useNavigate();
  const [subtopics, setSubtopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  useEffect(() => {
    fetchSubtopics();
  }, []);

  const fetchSubtopics = async () => {
    try {
      setLoading(true);
      const response = await topicsAPI.getAllSubtopics();
      setSubtopics(response.data || []);
    } catch (err) {
      setError('Failed to load subtopics. Please try again.');
      console.error('Error fetching subtopics:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-600/20 text-green-400 border-green-600/30';
      case 'medium':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30';
      case 'hard':
        return 'bg-red-600/20 text-red-400 border-red-600/30';
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
    }
  };

  const getMasteryColor = (accuracy) => {
    if (accuracy >= 80) return 'bg-green-600/20 text-green-400';
    if (accuracy >= 60) return 'bg-yellow-600/20 text-yellow-400';
    if (accuracy > 0) return 'bg-orange-600/20 text-orange-400';
    return 'bg-gray-600/20 text-gray-400';
  };

  const getMasteryLabel = (accuracy) => {
    if (accuracy >= 80) return 'Mastered';
    if (accuracy >= 60) return 'In Progress';
    if (accuracy > 0) return 'Needs Work';
    return 'Not Started';
  };

  const handleSubtopicClick = (subtopic) => {
    navigate(`/practice/problem/${subtopic.id}`, { 
      state: { 
        subtopic,
        difficulty: selectedDifficulty === 'all' ? undefined : selectedDifficulty 
      } 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Spinner size="xl" variant="gradient" label="Loading subtopics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">{error}</div>
        <Button onClick={fetchSubtopics} variant="primary">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-dark-100 mb-2">
          Choose a Subtopic
        </h1>
        <p className="text-dark-400">
          Select a subtopic to start practicing targeted problems
        </p>
      </div>

      {/* Difficulty Filter */}
      <Card className="mb-6">
        <Card.Header>
          <h3 className="text-lg font-semibold text-dark-100">Difficulty Level</h3>
        </Card.Header>
        <Card.Content>
          <div className="flex flex-wrap gap-2">
            {['all', 'easy', 'medium', 'hard'].map((difficulty) => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedDifficulty(difficulty)}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Button>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Subtopics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subtopics.map((subtopic) => (
          <Card
            key={subtopic.id}
            className="cursor-pointer hover:shadow-glow transition-all duration-300 hover:scale-105 group"
            onClick={() => handleSubtopicClick(subtopic)}
          >
            <Card.Content className="p-6">
              {/* Major Topic Badge */}
              <div className="mb-3">
                <Badge variant="secondary" className="text-xs">
                  {subtopic.major_topic_name}
                </Badge>
              </div>

              {/* Subtopic Name */}
              <h3 className="text-xl font-semibold text-dark-100 mb-2 group-hover:text-primary-400 transition-colors">
                {subtopic.name}
              </h3>

              {/* Description */}
              <p className="text-dark-400 text-sm mb-4 line-clamp-2">
                {subtopic.description}
              </p>

              {/* Problem Count */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-dark-400">
                  {subtopic.problem_count || 0} problems
                </span>
                {subtopic.average_difficulty && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getDifficultyColor(subtopic.average_difficulty)}`}
                  >
                    {subtopic.average_difficulty}
                  </Badge>
                )}
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark-400">Your Progress</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getMasteryColor(subtopic.accuracy || 0)}`}
                  >
                    {getMasteryLabel(subtopic.accuracy || 0)}
                  </Badge>
                </div>
                
                {subtopic.accuracy !== null && subtopic.accuracy !== undefined && (
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-primary-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(subtopic.accuracy || 0, 100)}%` }}
                    />
                  </div>
                )}

                {subtopic.attempts_count > 0 && (
                  <div className="text-xs text-dark-400">
                    {subtopic.correct_attempts || 0}/{subtopic.attempts_count} correct
                    {subtopic.accuracy !== null && subtopic.accuracy !== undefined && (
                      <span className="ml-2">({subtopic.accuracy.toFixed(1)}%)</span>
                    )}
                  </div>
                )}
              </div>
            </Card.Content>

            <Card.Footer className="px-6 py-4 bg-dark-800/50">
              <Button 
                variant="primary" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubtopicClick(subtopic);
                }}
              >
                Start Practice
              </Button>
            </Card.Footer>
          </Card>
        ))}
      </div>

      {subtopics.length === 0 && (
        <Card>
          <Card.Content className="text-center py-12">
            <div className="text-dark-400 mb-4">
              No subtopics available at the moment.
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

export default SubtopicSelection;