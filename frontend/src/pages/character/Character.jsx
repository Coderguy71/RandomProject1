import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button, Card, Spinner, Badge } from '../../components/ui';
import { characterAPI } from '../../services/apiServices';

const Character = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [character, setCharacter] = useState(null);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetchCharacter();
  }, []);

  const fetchCharacter = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await characterAPI.getCharacter();

      if (response.data?.character) {
        setCharacter(response.data.character);
        setSkills(response.data.character.skills || []);
      }
    } catch (err) {
      console.error('Error fetching character:', err);
      if (err.response?.status === 404) {
        setError('Character not found. Please create one.');
      } else {
        setError('Failed to load character. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="xl" variant="gradient" label="Loading your character..." />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-900/30 border border-red-800/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Character Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-premium">
          Character Profile
        </h1>
        <p className="text-base text-dark-400">
          Manage and track your character's development and skills.
        </p>
      </div>

      {character && (
        <>
          {/* Character Card */}
          <Card variant="glass" className="hover:shadow-glow transition-all duration-300">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-4 flex-1">
                  <div>
                    <p className="text-sm font-medium text-dark-400 mb-1">Character Name</p>
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-premium">
                      {character.character_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark-400 mb-1">Level</p>
                    <div className="flex items-center gap-3">
                      <p className="text-2xl font-bold text-primary-400">
                        {character.level}
                      </p>
                      <Badge variant="primary" className="text-xs">
                        Adventurer
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-primary-600/20 rounded-lg h-24 w-24 flex items-center justify-center">
                  <span className="text-5xl">⚔️</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Skills Section */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Skills</h2>
            {skills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill) => (
                  <Card key={skill.id} variant="glass" className="hover:shadow-glow transition-all duration-300">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white capitalize">
                          {skill.skill_name}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          Level {skill.skill_level}
                        </Badge>
                      </div>

                      {/* Skill Level Display */}
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                              level <= skill.skill_level
                                ? 'bg-gradient-premium'
                                : 'bg-dark-700'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Level Info */}
                      <p className="text-xs text-dark-400 mt-3">
                        {skill.skill_level} / 5
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card variant="glass">
                <div className="p-6 text-center">
                  <p className="text-dark-400">No skills found. This shouldn't happen!</p>
                </div>
              </Card>
            )}
          </div>

          {/* Character Stats Summary */}
          <Card variant="glass" className="hover:shadow-glow transition-all duration-300">
            <div className="p-6">
              <h2 className="text-lg font-bold text-white mb-4">Overview</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-dark-400 mb-1">Total Skills</p>
                  <p className="text-2xl font-bold text-primary-400">{skills.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-dark-400 mb-1">Average Level</p>
                  <p className="text-2xl font-bold text-primary-400">
                    {skills.length > 0
                      ? (
                          skills.reduce((sum, skill) => sum + skill.skill_level, 0) /
                          skills.length
                        ).toFixed(1)
                      : 'N/A'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-dark-400 mb-1">Max Level</p>
                  <p className="text-2xl font-bold text-primary-400">
                    {skills.length > 0
                      ? Math.max(...skills.map(skill => skill.skill_level))
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default Character;
