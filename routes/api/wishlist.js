const express = require('express');
const router = express.Router();
const pool = require('../../db');
const jwt = require('jsonwebtoken');
const verifyToken = require('../../middleware/verifyToken.js');
const secretKey = require('../../env');

router.use(verifyToken);

router.post('/addWish', async (req, res) => {
    try {
        const decoded = jwt.verify(req.token, secretKey);
        
        const user_id = decoded.user.user_id;
        const movie_id = req.body.movie_id;

        let movieOnWishlist = await pool.query('SELECT * from wishlist WHERE user_id = $1 AND movie_id = $2', [user_id, movie_id]);
        if (movieOnWishlist.rowCount === 0) {
            await pool.query(`INSERT INTO wishlist (user_id, movie_id) VALUES ($1, $2) RETURNING *`,[user_id, movie_id]);
            return res.status(200).json({message: 'Movie added to wishlist'});
        } else {
            return res.status(400).json({message: 'Movie already on wishlist'});
        }
    }
    catch (err) {
        console.log(err);
    }
});

router.post('/removeWish', async (req, res) => {
    try {
        const decoded = jwt.verify(req.token, secretKey);
        
        const user_id = decoded.user.user_id;
        const movie_id = req.body.movie_id;

        let movieOnWishlist = await pool.query('SELECT * from wishlist WHERE user_id = $1 AND movie_id = $2', [user_id, movie_id]);
        if (movieOnWishlist.rowCount === 0) {
            return res.status(400).json({message: 'Movie not found'});
        } else {
            await pool.query('DELETE FROM wishlist WHERE user_id = $1 AND movie_id = $2',[user_id, movie_id]);
            return res.status(200).json({message: 'Movie removed from wishlist'});
        }
    }
    catch (err) {
        console.log(err);
    }
});

router.get('/returnWishlist', async (req, res) => {
    try {
        const decoded = jwt.verify(req.token, secretKey);
        
        const user_id = decoded.user.user_id;

        let wishlist = await pool.query('SELECT movie_id from wishlist WHERE user_id = $1', [user_id]);
        res.json(wishlist.rows);
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;