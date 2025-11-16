import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { problemsAPI, attemptsAPI } from '../../services/apiServices';
import { Card, Button, Badge, ProgressBar, Spinner, Modal } from '../ui';

const PracticeProblem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subtopic, difficulty } = location.state || {};

  const [problems, setProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [sessionStats, setSessionStats] = useState({
    problemsAttempted: 0,
    correctAnswers: 0,
    startTime: Date.now(),
  });
  const [problemStartTime, setProblemStartTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [sessionResults, setSessionResults] = useState(null);

  const currentProblem = problems[currentProblemIndex];

  useEffect(() => {
    if (!subtopic) {
      navigate('/practice');
      return;
    }
    fetchProblems();
  }, [subtopic, difficulty, navigate]);

  useEffect(() => {
    setProblemStartTime(Date.now());
  }, [currentProblemIndex]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const params = { subtopic_id: subtopic.id };
      if (difficulty && difficulty !== 'all') {
        params.difficulty = difficulty;
      }
      
      const response = await problemsAPI.getProblems(params);
      setProblems(response.data || []);
    } catch (error) {
      console.error('Error fetching problems:', error);
      navigate('/practice');
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

  const handleAnswerSelect = (answer) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !currentProblem) return;

    try {
      setSubmitting(true);
      const timeTaken = Math.round((Date.now() - problemStartTime) / 1000);
      
      const response = await attemptsAPI.submitAnswer(
        currentProblem.id,
        selectedAnswer,
        timeTaken
      );

      setFeedback(response.data);
      setShowFeedback(true);

      const isCorrect = response.data.is_correct;
      setSessionStats(prev => ({
        ...prev,
        problemsAttempted: prev.problemsAttempted + 1,
        correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      }));

    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextProblem = () => {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
      setSelectedAnswer('');
      setShowFeedback(false);
      setFeedback(null);
    } else {
      // End of session
      endSession();
    }
  };

  const handleSkipProblem = () => {
    handleNextProblem();
  };

  const endSession = () => {
    const endTime = Date.now();
    const totalTime = Math.round((endTime - sessionStats.startTime) / 1000);
    const accuracy = sessionStats.problemsAttempted > 0 
      ? (sessionStats.correctAnswers / sessionStats.problemsAttempted) * 100 
      : 0;

    setSessionResults({
      totalProblems: problems.length,
      problemsAttempted: sessionStats.problemsAttempted,
      correctAnswers: sessionStats.correctAnswers,
      accuracy: accuracy.toFixed(1),
      totalTime: totalTime,
      subtopic: subtopic.name,
    });
    setShowResultsModal(true);
  };

  const handleExitSession = () => {
    if (sessionStats.problemsAttempted > 0) {
      endSession();
    } else {
      navigate('/practice');
    }
  };

  const handleContinuePracticing = () => {
    setShowResultsModal(false);
    navigate('/practice');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Spinner size="xl" variant="gradient" label="Loading problems..." />
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-dark-100 mb-4">
          No Problems Available
        </h2>
        <p className="text-dark-400 mb-6">
          There are no problems available for this subtopic yet.
        </p>
        <Button onClick={() => navigate('/practice')} variant="primary">
          Back to Subtopics
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Session Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-100">
              {subtopic.name}
            </h1>
            <p className="text-dark-400">
              Problem {currentProblemIndex + 1} of {problems.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className={getDifficultyColor(currentProblem?.difficulty_level)}>
              {currentProblem?.difficulty_level}
            </Badge>
            <Button variant="ghost" onClick={() => setShowExitModal(true)}>
              Exit Session
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar 
          value={((currentProblemIndex + (showFeedback ? 1 : 0)) / problems.length) * 100}
          className="mb-4"
        />

        {/* Session Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card variant="dark">
            <Card.Content className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-400">
                {sessionStats.correctAnswers}
              </div>
              <div className="text-sm text-dark-400">Correct</div>
            </Card.Content>
          </Card>
          <Card variant="dark">
            <Card.Content className="p-4 text-center">
              <div className="text-2xl font-bold text-dark-100">
                {sessionStats.problemsAttempted}
              </div>
              <div className="text-sm text-dark-400">Attempted</div>
            </Card.Content>
          </Card>
          <Card variant="dark">
            <Card.Content className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {sessionStats.problemsAttempted > 0 
                  ? ((sessionStats.correctAnswers / sessionStats.problemsAttempted) * 100).toFixed(0)
                  : 0}%
              </div>
              <div className="text-sm text-dark-400">Accuracy</div>
            </Card.Content>
          </Card>
          <Card variant="dark">
            <Card.Content className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {formatTime(Math.round((Date.now() - sessionStats.startTime) / 1000))}
              </div>
              <div className="text-sm text-dark-400">Time</div>
            </Card.Content>
          </Card>
        </div>
      </div>

      {/* Problem Card */}
      <Card className="mb-6">
        <Card.Content className="p-6 sm:p-8">
          {/* Question */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-dark-100 mb-6">
              {currentProblem?.question_text}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-8">
            {currentProblem?.options?.map((option, index) => {
              const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
              const isSelected = selectedAnswer === optionLetter;
              const isCorrect = feedback?.correct_answer === optionLetter;
              const showCorrect = showFeedback && isCorrect;
              const showIncorrect = showFeedback && isSelected && !isCorrect;

              return (
                <div
                  key={index}
                  onClick={() => handleAnswerSelect(optionLetter)}
                  className={`
                    relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${showCorrect 
                      ? 'bg-green-600/20 border-green-400' 
                      : showIncorrect
                      ? 'bg-red-600/20 border-red-400'
                      : isSelected
                      ? 'bg-primary-600/20 border-primary-400'
                      : 'bg-dark-800 border-dark-600 hover:border-primary-500 hover:bg-dark-700/50'
                    }
                    ${showFeedback ? 'cursor-not-allowed' : ''}
                  `}
                >
                  <div className="flex items-center">
                    <div className={`
                      w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center
                      ${showCorrect
                        ? 'border-green-400 bg-green-400'
                        : showIncorrect
                        ? 'border-red-400 bg-red-400'
                        : isSelected
                        ? 'border-primary-400 bg-primary-400'
                        : 'border-dark-400'
                      }
                    `}>
                      {showCorrect && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {showIncorrect && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                      {!showFeedback && isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-dark-100 font-medium mr-3">
                      {optionLetter}.
                    </span>
                    <span className="text-dark-100 flex-1">
                      {option}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feedback Section */}
          {showFeedback && feedback && (
            <div className={`
              p-4 rounded-lg mb-6 animate-fade-in
              ${feedback.is_correct 
                ? 'bg-green-600/20 border border-green-600/30' 
                : 'bg-red-600/20 border border-red-600/30'
              }
            `}>
              <div className="flex items-center mb-3">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center mr-3
                  ${feedback.is_correct ? 'bg-green-400' : 'bg-red-400'}
                `}>
                  {feedback.is_correct ? (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <h3 className={`text-lg font-semibold ${feedback.is_correct ? 'text-green-400' : 'text-red-400'}`}>
                  {feedback.is_correct ? 'Correct!' : 'Incorrect'}
                </h3>
              </div>

              {!feedback.is_correct && (
                <p className="text-dark-200 mb-2">
                  <span className="font-medium">Correct answer:</span> {feedback.correct_answer}
                </p>
              )}

              {feedback.explanation && (
                <div className="mt-3 p-3 bg-dark-800/50 rounded-lg">
                  <h4 className="font-medium text-dark-100 mb-2">Explanation:</h4>
                  <p className="text-dark-300 text-sm">{feedback.explanation}</p>
                </div>
              )}

              {/* Village Rewards */}
              {feedback.village_rewards && (
                <div className="mt-4 p-3 bg-purple-600/20 border border-purple-600/30 rounded-lg">
                  <h4 className="font-medium text-purple-400 mb-2">🎉 Rewards Earned:</h4>
                  <div className="flex flex-wrap gap-2">
                    {feedback.village_rewards.resources.gold > 0 && (
                      <Badge variant="outline">+{feedback.village_rewards.resources.gold} Gold</Badge>
                    )}
                    {feedback.village_rewards.resources.gems > 0 && (
                      <Badge variant="outline">+{feedback.village_rewards.resources.gems} Gems</Badge>
                    )}
                    {feedback.village_rewards.resources.wood > 0 && (
                      <Badge variant="outline">+{feedback.village_rewards.resources.wood} Wood</Badge>
                    )}
                    {feedback.village_rewards.experience > 0 && (
                      <Badge variant="outline">+{feedback.village_rewards.experience} XP</Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between">
            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                onClick={handleSkipProblem}
                disabled={showFeedback}
              >
                Skip
              </Button>
            </div>

            <div className="flex gap-3">
              {!showFeedback ? (
                <Button 
                  variant="primary" 
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer || submitting}
                  loading={submitting}
                >
                  Submit Answer
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  onClick={handleNextProblem}
                >
                  {currentProblemIndex < problems.length - 1 ? 'Next Problem' : 'Finish Session'}
                </Button>
              )}
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Exit Confirmation Modal */}
      <Modal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        title="Exit Practice Session?"
      >
        <div className="space-y-4">
          <p className="text-dark-300">
            Are you sure you want to exit this practice session? Your progress will be saved.
          </p>
          <div className="flex justify-end gap-3">
            <Button 
              variant="ghost" 
              onClick={() => setShowExitModal(false)}
            >
              Continue Practicing
            </Button>
            <Button 
              variant="danger" 
              onClick={handleExitSession}
            >
              Exit Session
            </Button>
          </div>
        </div>
      </Modal>

      {/* Session Results Modal */}
      <Modal
        isOpen={showResultsModal}
        onClose={() => {}}
        title="Session Complete!"
        size="lg"
      >
        <div className="space-y-6">
          {/* Results Summary */}
          <div className="text-center">
            <div className="text-4xl mb-2">
              {sessionResults?.accuracy >= 80 ? '🎉' : sessionResults?.accuracy >= 60 ? '👍' : '📚'}
            </div>
            <h3 className="text-2xl font-bold text-dark-100 mb-2">
              Great Work!
            </h3>
            <p className="text-dark-400">
              You've completed the practice session for {sessionResults?.subtopic}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card variant="dark">
              <Card.Content className="p-4 text-center">
                <div className="text-2xl font-bold text-primary-400">
                  {sessionResults?.correctAnswers}/{sessionResults?.problemsAttempted}
                </div>
                <div className="text-sm text-dark-400">Correct Answers</div>
              </Card.Content>
            </Card>
            <Card variant="dark">
              <Card.Content className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">
                  {sessionResults?.accuracy}%
                </div>
                <div className="text-sm text-dark-400">Accuracy</div>
              </Card.Content>
            </Card>
            <Card variant="dark">
              <Card.Content className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {formatTime(sessionResults?.totalTime || 0)}
                </div>
                <div className="text-sm text-dark-400">Total Time</div>
              </Card.Content>
            </Card>
            <Card variant="dark">
              <Card.Content className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {sessionResults?.problemsAttempted}
                </div>
                <div className="text-sm text-dark-400">Problems Attempted</div>
              </Card.Content>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3">
            <Button 
              variant="secondary" 
              onClick={handleContinuePracticing}
            >
              Back to Topics
            </Button>
            <Button 
              variant="primary" 
              onClick={() => {
                setShowResultsModal(false);
                setCurrentProblemIndex(0);
                setSelectedAnswer('');
                setShowFeedback(false);
                setFeedback(null);
                setSessionStats({
                  problemsAttempted: 0,
                  correctAnswers: 0,
                  startTime: Date.now(),
                });
              }}
            >
              Try Again
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PracticeProblem;