'use strict';

const fs = require('fs');
const path = require('path');

exports.up = function (db, callback) {
  const sql = fs.readFileSync(path.join(__dirname, 'sqls/create-character-tables-up.sql'), 'utf8');
  db.runSql(sql, callback);
};

exports.down = function (db, callback) {
  const sql = fs.readFileSync(path.join(__dirname, 'sqls/create-character-tables-down.sql'), 'utf8');
  db.runSql(sql, callback);
};
