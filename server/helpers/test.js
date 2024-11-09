import fs from 'fs';
import path from 'path';
import { pool } from './db.js';
import jwt  from 'jsonwebtoken';
import { hash } from 'bcrypt';

const { sign } = jwt

const __dirname = import.meta.dirname

const initializeTestDb = () => {
    const sql = fs.readFileSync(path.resolve(__dirname, "../tasks.sql"), "utf8");
    pool.query(sql)
}

const insertTestUSer = (email, password) => {
    hash(password, 10, (error, hashsedPassword) => {
        pool.query('insert into account (email,password) values ($1,$2)',
            [email, hashsedPassword]
        )
    })
}

const getToken = (email) => {
    return sign({user: email}, process.env.JWT_SECRET_KEY)
}
export { initializeTestDb, insertTestUSer, getToken }
