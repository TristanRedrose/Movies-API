const express = require('express');
const router = express.Router();
const pool = require('../../db');
const jwt = require('jsonwebtoken');
const verifyToken = require('../../middleware/verifyToken.js');
const secretKey = require('../../env');

router.use(verifyToken);

router.post('/wishlist', async (req, res) => {
    try {
        const decoded = jwt.verify(req.token, secretKey);
        
        const user_id = decoded.user.user_id;
        const movie_id = req.body.movie_id;

        let movieOnWishlist = await pool.query('SELECT * from wishlist WHERE user_id = $1 AND movie_id = $2', [user_id, movie_id]);
        if (movieOnWishlist.rowCount === 0) {
            await pool.query(`INSERT INTO wishlist (user_id, movie_id) VALUES ($1, $2) RETURNING *`,[user_id, movie_id]);
            return res.json({message: 'Movie added to wishlist'});
        } else {
            await pool.query(`DELETE FROM wishlist WHERE user_id = $1 AND movie_id = $2`,[user_id, movie_id]);
            return res.json({message: 'Movie removed from wishlist'});
        }
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;