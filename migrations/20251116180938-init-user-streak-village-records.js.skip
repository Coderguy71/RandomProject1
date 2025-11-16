'use strict';

const fs = require('fs');
const path = require('path');

exports.up = function (db, callback) {
  const sql = fs.readFileSync(path.join(__dirname, 'sqls/20251116180938-init-user-streak-village-records-up.sql'), 'utf8');
  db.runSql(sql, callback);
};

exports.down = function (db, callback) {
  const sql = fs.readFileSync(path.join(__dirname, 'sqls/20251116180938-init-user-streak-village-records-down.sql'), 'utf8');
  db.runSql(sql, callback);
};
