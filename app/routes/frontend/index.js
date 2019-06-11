var express = require('express');
var router = express.Router();

const middlewareGetUserInfo = require(__path_middlewares + 'get-user-info');
const middlewareGetCategories = require(__path_middlewares + 'get-categories');
const middlewareGetBrands = require(__path_middlewares + 'get-brands');

router.use('/', middlewareGetUserInfo, middlewareGetCategories, middlewareGetBrands, require('./home'));
router.use('/auth', require('./auth'));
router.use('/categories', require('./categories'));
router.use('/brands', require('./brands'));
router.use('/details', require('./details'));

module.exports = router;
