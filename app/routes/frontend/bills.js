var express = require('express');
var router = express.Router();

const ProductModel = require(__path_models + 'products');
const StringHelpers = require(__path_helpers + 'strings');
const ParamsHelpers = require(__path_helpers + 'params');
const systemConfig = require(__path_configs + 'system');

const folderView = __path_views_frontend + 'pages/bills/';
const layoutFrontend = __path_views_frontend + 'frontend';

const pageTitle = 'bills';

router.get('/cart', async (req, res, next) => {
    let params = {};
    let productsChoose = [];
    params.array_id = req.session.products_choose_id;
    await ProductModel.listProductsFrontend(params, {task: 'product-in-id-array'}).then((products) => {
        productsChoose = products;
    })

    res.render(`${folderView}cart`, {
        layout: layoutFrontend,
        pageTitle: 'cart',
        productsChoose
    });
});


module.exports = router;