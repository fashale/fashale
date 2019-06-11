var express = require('express');
var router = express.Router();

const ProductModel = require(__path_models + 'products');
const BrandModel = require(__path_models + 'brands');
const StringHelpers = require(__path_helpers + 'strings');
const ParamsHelpers = require(__path_helpers + 'params');


const folderView = __path_views_frontend + 'pages/brands/';
const layoutFrontend = __path_views_frontend + 'frontend';

const pageTitle = 'brands';

router.get('/:brand_name/(:sort_type)?', async (req, res, next) => {
    let brand_slug = ParamsHelpers.getParam(req.params, 'brand_name', '');
    let sort_type_slug = ParamsHelpers.getParam(req.params, 'sort_type', 'product-new');

    let params = {
        keyword: ''
    };

    params.pagination = {
        totalItems: 1,
        totalItemsPerPage: 3,
        currentPage: parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
        pageRanges: 5
    }

    let idBrand = '';
    let nameBrand = '';
    await BrandModel.listBrands().then((brands) => {
        brands.forEach((brand) => {
            if (StringHelpers.createSlug(brand.name) == brand_slug) {
                idBrand = brand.id;
                nameBrand = brand.name;
            }
        })
    })
    params.id = idBrand;

    await ProductModel.countProductsFrontend(params, 'brands').then((number) => {
        params.pagination.totalItems = number;
    });
    let productInBrand = [];
    await ProductModel.listProductsFrontend(params, {task: sort_type_slug + '-in-brand'}).then((product) => {
        productInBrand = product;
    });


    res.render(`${folderView}index`, {
        layout: layoutFrontend,
        pageTitle,
        nameBrand,
        productInBrand,
        params,
        sort_type_slug
    });
});

module.exports = router;