var express = require('express');
var router = express.Router();

const middleAuthentication = require(__path_middlewares + 'auth');

router.use('/', middleAuthentication, require('./products'));
router.use('/products', require('./products'));
router.use('/categories', require('./categories'));
router.use('/brands', require('./brands'));
//router.use('/bills', require('./bills'));
router.use('/users', require('./users'));

module.exports = router;