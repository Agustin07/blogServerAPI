import { Pool } from 'pg'

export const connectpg = new Pool({
    user:'postgres',
    host:'localhost',
    password:'postgres',
    database: 'blogDB',
    port: 5432
});