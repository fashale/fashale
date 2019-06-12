var express = require('express');
var router = express.Router();

const ProductModel = require(__path_models + 'products');
const StringHelpers = require(__path_helpers + 'strings');
const ParamsHelpers = require(__path_helpers + 'params');
const systemConfig = require(__path_configs + 'system');

const folderView = __path_views_frontend + 'pages/details/';
const layoutFrontend = __path_views_frontend + 'frontend';

const pageTitle = 'details';

router.get('/:brand_name/:category_name/:product_name', async (req, res, next) => {
    let product_slug = ParamsHelpers.getParam(req.params, 'product_name', '');
    let brand_name_slug = ParamsHelpers.getParam(req.params, 'brand_name', '');
    let category_name_slug = ParamsHelpers.getParam(req.params, 'category_name', '');
    let idProduct = '';
    let idCategoryProduct = '';
    let idBrandProduct = '';
    let viewsProduct = 0;
    await ProductModel.listProductsFrontend(null, {task: 'product'}).then((products) => {
        products.forEach((product) => {
            if (StringHelpers.createSlug(product.name) == product_slug && StringHelpers.createSlug(product.brand.name) == brand_name_slug 
            && StringHelpers.createSlug(product.category.name) == category_name_slug) {
                idProduct = product.id;
                idCategoryProduct = product.category.id;
                idBrandProduct = product.brand.id;
                (product.views == undefined || product.views == null) ? viewsProduct = 0 : viewsProduct = product.views;
            }
        })
    })

    await ProductModel.updateViews(idProduct, viewsProduct);

    let productDetail = [];
    await ProductModel.listProductsFrontend({id: idProduct}, {task: 'product-detail'}).then((product) => {
        productDetail = product;
    });

    let productRandomInCategory = [];
    await ProductModel.listProductsFrontend({id: idCategoryProduct}, {task: 'product-random-in-category'}).then((product) => {
        productRandomInCategory = product;
    })

    let productRandomInBrand = [];
    await ProductModel.listProductsFrontend({id: idBrandProduct}, {task: 'product-random-in-brand'}).then((product) => {
        productRandomInBrand = product;
    })

    res.render(`${folderView}index`, {
        layout: layoutFrontend,
        pageTitle,
        product: productDetail[0],
        productRandomInCategory,
        productRandomInBrand,
        disabled: (req.session.products_choose_id != undefined && req.session.products_choose_id.includes(productDetail[0].id)) ? true : false,
        user: (req.isAuthenticated()) ? true : false
    });
});

router.post('/:brand_name/:category_name/:product_name', async (req, res, next) => {
    req.body = JSON.parse(JSON.stringify(req.body));
    let comment = Object.assign(req.body);
    let product_slug = ParamsHelpers.getParam(req.params, 'product_name', '');
    let brand_name_slug = ParamsHelpers.getParam(req.params, 'brand_name', '');
    let category_name_slug = ParamsHelpers.getParam(req.params, 'category_name', '');
    let idProduct = '';
    await ProductModel.listProductsFrontend(null, {task: 'product'}).then((products) => {
        products.forEach((product) => {
            if (StringHelpers.createSlug(product.name) == product_slug && StringHelpers.createSlug(product.brand.name) == brand_name_slug 
            && StringHelpers.createSlug(product.category.name) == category_name_slug) {
                idProduct = product.id;
            }
        })
    })
    
    if (comment.content != undefined) {
        let comments_product = [];
        await ProductModel.getProduct(idProduct).then((product) => {
            comments_product = product.comments;
        })
        await ProductModel.addComment(idProduct, comments_product, comment, req.user).then(() => {
            let linkDetail = StringHelpers.formatLink('/' + systemConfig.prefixFrontend + '/details/' + brand_name_slug + '/' + category_name_slug + '/' + product_slug);
            res.redirect(linkDetail);
        })  
    } else {
        if (req.session.products_choose_id == undefined) {
            req.session.products_choose_id = [];
        }
        req.session.products_choose_id.push(idProduct);
        let linkDetail = StringHelpers.formatLink('/' + systemConfig.prefixFrontend + '/details/' + brand_name_slug + '/' + category_name_slug + '/' + product_slug);
        res.redirect(linkDetail);
    }
});


module.exports = router;