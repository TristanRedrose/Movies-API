const express = require('express');
const router = express.Router();
const pool = require('../../db');
const jwt = require('jsonwebtoken');
const secretKey = require('../../env');

// Create user
router.post('/register', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        
        if (
            (!username || !password) 
            || (username.trim() === '' || password.trim() === '')
        ) {
            return res.status(400).json({message: 'Username and password cannot be empty'});
        }

        //TODO check if it actually works

        const userExists = await pool.query(`SELECT COUNT (*) FROM users WHERE username = $1`,[username]);
        if (userExists) {
            return res.status(400).json({message: "Username already taken"});
        }
        
        const newUser = await pool.query(`INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`,[username, password]);
        
        jwt.sign({ user: newUser.rows[0] }, secretKey, {expiresIn: '60m'}, (err, token) => {
            res.json({
                message: 'Registration successful',
                token: token
            });
        });

    } catch(err) {
        console.log(err.message);
    };
});

// Login user
router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (
        (!username || !password) 
        || (username.trim() === '' || password.trim() === '')
    ) {
        return res.status(400).json({message: 'Username and password cannot be empty'})
    }

    const user = await pool.query(`SELECT * FROM users WHERE username = $1`,[username]);

    if (user.rowCount === 0 || user.password !== password) {
        return res.status(400).json({message: 'Invalid username/password'});
    }

    jwt.sign({ user: user.rows[0] }, secretKey, {expiresIn: '60m'}, (err, token) => {
        res.json({
            message: 'Login successful',
            token: token
        });
    });
});

module.exports = router;