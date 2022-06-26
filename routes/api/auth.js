const express = require('express');
const router = express.Router();
const pool = require('../../db');

// Create user
router.post('/register', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        
        if (
            (!username || !password) 
            || (username.trim() === '' || password.trim() === '')
        ) {
            return res.json({message: 'Username and password cannot be empty'})
        }

        const userExists = await pool.query(`SELECT * FROM users WHERE username = $1`,[username]);
        if (userExists.rowCount > 0 ) {
            return res.json({message: "Username already taken"})
        }
        
        const newUser = await pool.query(`INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`,[username, password]);
        return res.json(newUser);

    } catch(err) {
        console.log(err.message);
    };
});

module.exports = router;