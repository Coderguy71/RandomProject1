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

exports.up = function(db, callback) {
  const sql = require('fs').readFileSync(require('path').join(__dirname, 'sqls/20251116173925-seed-sat-math-practice-problems-up.sql'), 'utf8');
  db.runSql(sql, callback);
};

exports.down = function(db, callback) {
  const sql = require('fs').readFileSync(require('path').join(__dirname, 'sqls/20251116173925-seed-sat-math-practice-problems-down.sql'), 'utf8');
  db.runSql(sql, callback);
};

exports._meta = {
  "version": 1
};
