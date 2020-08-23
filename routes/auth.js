const express = require('express');
const passport = require('passport');
const router = express.Router();


// Auth with Google
// GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// Google Auth callback
// GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/dashboard');
    });

// Logout user
// /auth/logout
router.get('/logout', (req, res) => {
    req.logout(); // with the passport middleware once we log in we'll have a logout method on req object;
    res.redirect('/');
});
module.exports = router;