var express = require('express');
var router = express.Router();

const ProductModel = require(__path_models + 'products');
const CategoryModel = require(__path_models + 'categories');
const StringHelpers = require(__path_helpers + 'strings');
const ParamsHelpers = require(__path_helpers + 'params');


const folderView = __path_views_frontend + 'pages/categories/';
const layoutFrontend = __path_views_frontend + 'frontend';

const pageTitle = 'categories';

router.get('/:gender/:category_name/(:sort_type)?', async (req, res, next) => {
    let category_slug = ParamsHelpers.getParam(req.params, 'category_name', '');
    let gender_slug = ParamsHelpers.getParam(req.params, 'gender', '');
    let sort_type_slug = ParamsHelpers.getParam(req.params, 'sort_type', 'product-new');

    let params = {
        keyword: '',
        gender: (gender_slug == 'male') ? 'Nam' : 'Nữ'
    };

    params.pagination = {
        totalItems: 1,
        totalItemsPerPage: 4,
        currentPage: parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
        pageRanges: 5
    }

    let idCategory = '';
    let nameCategory = '';
    await CategoryModel.listCategoriesInSelectbox(params).then((categories) => {
        categories.forEach((category) => {
            if (StringHelpers.createSlug(category.name) == category_slug) {
                idCategory = category.id;
                nameCategory = category.name;
            }
        })
    })
    params.id = idCategory;

    await ProductModel.countProductsFrontend(params, 'categories').then((number) => {
        params.pagination.totalItems = number;
    });
    let productInCategory = [];
    await ProductModel.listProductsFrontend(params, {task: sort_type_slug + '-in-category'}).then((product) => {
        productInCategory = product;
    });


    res.render(`${folderView}index`, {
        layout: layoutFrontend,
        pageTitle,
        nameCategory,
        productInCategory,
        params,
        sort_type_slug
    });
});

module.exports = router;