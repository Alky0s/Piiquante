// We import express package create express router
const express = require('express');
const router = express.Router();
// We imports our user controller
const userCtrl = require('../controllers/user');
// Routes for signup and login
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
// We exports the router
module.exports = router;