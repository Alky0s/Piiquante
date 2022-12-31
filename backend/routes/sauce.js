// We import express package create express router
const express = require('express');
const router = express.Router();
// We imports auth and multer middlewares
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
// We imports our sauce controller
const sauceCtrl = require('../controllers/sauce');
// All routes
router.get('/', auth,sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);
// We exports express router 
module.exports = router;