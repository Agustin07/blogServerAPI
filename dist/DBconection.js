"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectpg = void 0;
const pg_1 = require("pg");
exports.connectpg = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'postgres',
    database: 'blogDB',
    port: 5432
});
