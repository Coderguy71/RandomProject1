'use strict';

const fs = require('fs');
const path = require('path');

exports.up = function (db, callback) {
  const sql = fs.readFileSync(path.join(__dirname, 'sqls/20251115191200-add-topic-to-community-posts-up.sql'), 'utf8');
  db.runSql(sql, callback);
};

exports.down = function (db, callback) {
  const sql = fs.readFileSync(path.join(__dirname, 'sqls/20251115191200-add-topic-to-community-posts-down.sql'), 'utf8');
  db.runSql(sql, callback);
};
