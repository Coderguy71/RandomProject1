'use strict';

exports.up = function(db, callback) {
  db.runSqlFile('migrations/sqls/20251115194000-enhanced-tutorial-content-up.sql', callback);
};

exports.down = function(db, callback) {
  db.runSqlFile('migrations/sqls/20251115194000-enhanced-tutorial-content-down.sql', callback);
};