'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('learning_path_recommendations', {
    id: { type: 'uuid', primaryKey: true, defaultValue: new String('uuid_generate_v4()') },
    user_id: { type: 'uuid', notNull: true, foreignKey: {
      name: 'learning_path_recommendations_user_id_fkey',
      table: 'users',
      mapping: 'id',
      rules: {
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT'
      }
    }},
    subtopic_id: { type: 'uuid', notNull: true, foreignKey: {
      name: 'learning_path_recommendations_subtopic_id_fkey',
      table: 'subtopics',
      mapping: 'id',
      rules: {
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT'
      }
    }},
    recommendation_type: { type: 'string', length: 50, notNull: true }, -- 'next_topic', 'review', 'practice', 'challenge'
    priority: { type: 'int', notNull: true, defaultValue: 1 }, -- 1=highest, 5=lowest
    difficulty_level: { type: 'string', length: 50 }, -- 'easy', 'medium', 'hard'
    reason: { type: 'text' }, -- Explanation for the recommendation
    is_completed: { type: 'boolean', defaultValue: false },
    completed_at: { type: 'timestamp', timezone: true },
    created_at: { type: 'timestamp', timezone: true, defaultValue: new String('CURRENT_TIMESTAMP') },
    updated_at: { type: 'timestamp', timezone: true, defaultValue: new String('CURRENT_TIMESTAMP') }
  })
  .then(() => {
    return db.createTable('learning_path_progress', {
      id: { type: 'uuid', primaryKey: true, defaultValue: new String('uuid_generate_v4()') },
      user_id: { type: 'uuid', notNull: true, foreignKey: {
        name: 'learning_path_progress_user_id_fkey',
        table: 'users',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        }
      }},
      major_topic_id: { type: 'uuid', notNull: true, foreignKey: {
        name: 'learning_path_progress_major_topic_id_fkey',
        table: 'major_topics',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        }
      }},
      current_subtopic_id: { type: 'uuid', foreignKey: {
        name: 'learning_path_progress_current_subtopic_id_fkey',
        table: 'subtopics',
        mapping: 'id',
        rules: {
          onDelete: 'SET NULL',
          onUpdate: 'RESTRICT'
        }
      }},
      mastery_level: { type: 'decimal', precision: 5, scale: 2, defaultValue: 0.00 }, -- 0-100%
      subtopics_completed: { type: 'int', defaultValue: 0 },
      total_subtopics: { type: 'int', defaultValue: 0 },
      last_recommendation_at: { type: 'timestamp', timezone: true },
      engagement_score: { type: 'decimal', precision: 5, scale: 2, defaultValue: 0.00 }, -- Based on recent activity
      created_at: { type: 'timestamp', timezone: true, defaultValue: new String('CURRENT_TIMESTAMP') },
      updated_at: { type: 'timestamp', timezone: true, defaultValue: new String('CURRENT_TIMESTAMP') },
      unique: ['user_id', 'major_topic_id']
    });
  })
  .then(() => {
    return db.addIndex('learning_path_recommendations', 'idx_learning_path_recommendations_user_id', ['user_id']);
  })
  .then(() => {
    return db.addIndex('learning_path_recommendations', 'idx_learning_path_recommendations_subtopic_id', ['subtopic_id']);
  })
  .then(() => {
    return db.addIndex('learning_path_recommendations', 'idx_learning_path_recommendations_user_priority', ['user_id', 'priority']);
  })
  .then(() => {
    return db.addIndex('learning_path_progress', 'idx_learning_path_progress_user_id', ['user_id']);
  })
  .then(() => {
    return db.addIndex('learning_path_progress', 'idx_learning_path_progress_major_topic_id', ['major_topic_id']);
  })
  .then(() => {
    return db.addIndex('learning_path_progress', 'idx_learning_path_progress_user_major', ['user_id', 'major_topic_id']);
  })
  .then(() => {
    // Create trigger function to update updated_at timestamp
    return db.runSql(`
      CREATE OR REPLACE FUNCTION update_learning_path_timestamp()
      RETURNS TRIGGER AS $
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $ LANGUAGE plpgsql;
    `);
  })
  .then(() => {
    // Create triggers for both tables
    return db.runSql(`
      CREATE TRIGGER update_learning_path_recommendations_timestamp
        BEFORE UPDATE ON learning_path_recommendations
        FOR EACH ROW
        EXECUTE FUNCTION update_learning_path_timestamp();
      
      CREATE TRIGGER update_learning_path_progress_timestamp
        BEFORE UPDATE ON learning_path_progress
        FOR EACH ROW
        EXECUTE FUNCTION update_learning_path_timestamp();
    `);
  });
};

exports.down = function(db) {
  return db.dropTable('learning_path_recommendations')
    .then(() => {
      return db.dropTable('learning_path_progress');
    })
    .then(() => {
      return db.runSql('DROP FUNCTION IF EXISTS update_learning_path_timestamp()');
    });
};

exports._meta = {
  "version": 1
};
