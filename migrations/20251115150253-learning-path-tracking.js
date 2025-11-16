'use strict';

const fs = require('fs');
const path = require('path');

exports.up = function (db, callback) {
  const sql = fs.readFileSync(path.join(__dirname, 'sqls/20251115150253-learning-path-tracking-up.sql'), 'utf8');
  db.runSql(sql, callback);
};

exports.down = function (db, callback) {
  const sql = fs.readFileSync(path.join(__dirname, 'sqls/20251115150253-learning-path-tracking-down.sql'), 'utf8');
  db.runSql(sql, callback);
};

exports._meta = {
  "version": 1
};
