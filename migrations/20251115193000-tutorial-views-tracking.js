'use strict';

exports.up = function(db, callback) {
  db.createTable('tutorial_views', {
    id: { type: 'uuid', primaryKey: true, defaultValue: new db.fn.uuid_generate_v4() },
    user_id: { 
      type: 'uuid', 
      notNull: true,
      foreignKey: {
        name: 'fk_tutorial_views_user_id',
        table: 'users',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE'
        }
      }
    },
    tutorial_id: { 
      type: 'uuid', 
      notNull: true,
      foreignKey: {
        name: 'fk_tutorial_views_tutorial_id',
        table: 'tutorials',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE'
        }
      }
    },
    viewed_at: { type: 'timestamp with time zone', notNull: true, defaultValue: new db.fn.now() },
    completed: { type: 'boolean', defaultValue: false }
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('tutorial_views', callback);
};