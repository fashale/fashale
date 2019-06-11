var express = require('express');
var router = express.Router();

const ProductModel = require(__path_models + 'products');
const CategoryModel = require(__path_models + 'categories');
const BrandModel = require(__path_models + 'brands');
const ParamsHelpers = require(__path_helpers + 'params');

const folderView = __path_views_frontend + 'pages/home/';
const layoutFrontend = __path_views_frontend + 'frontend';

const pageTitle = 'home';

router.get('/', async (req, res, next) => {

  let params = {
    keyword: ''
  };

  params.pagination = {
    totalItems: 1,
    totalItemsPerPage: 2,
    currentPage: parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
    pageRanges: 5
  }

  await ProductModel.countProductsFrontend(params).then((number) => {
    params.pagination.totalItems = number;
  });

  let productsMostViews = [];
  await ProductModel.listProductsFrontend(params, {task: 'product-most-views'}).then((products) => {
    productsMostViews = products;
  });

  let productsNew = [];
  await ProductModel.listProductsFrontend(params, {task: 'product-new'}).then((products) => {
    productsNew = products;
  });

  let productsAllPublish = [];
  await ProductModel.listProductsFrontend(params, {task: 'product'}).then((products) => {
    productsAllPublish = products;
  });

  

  let productsTopNewCategories = [];
  await CategoryModel.listCategories().then((categories) => {
    categories.forEach((category) => {
      for (let index = 0; index < productsAllPublish.length; index++) {
        if (productsAllPublish[index].category.name == category.name) {
          productsTopNewCategories.push(productsAllPublish[index]);
          break;
        }
      }
    })
  })

  let productsTopNewBrands = [];
  await BrandModel.listBrands().then((brands) => {
    brands.forEach((brand) => {
      for (let index = 0; index < productsAllPublish.length; index++) {
        if (productsAllPublish[index].brand.name == brand.name) {
          productsTopNewBrands.push(productsAllPublish[index]);
          break;
        }
      }
    })
  })


  res.render(`${folderView}index`, {
    layout: layoutFrontend,
    pageTitle,
    productsNew,
    productsTopNewCategories,
    productsTopNewBrands,
    productsMostViews,
    params
  });
});

router.get('/search', async (req, res, next) => {
  console.log('a')
  let params = {};
  params.keyword = ParamsHelpers.getParam(req.query, 'keyword', '');

  params.pagination = {
    totalItems: 1,
    totalItemsPerPage: 4,
    currentPage: parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
    pageRanges: 5
  }

  await ProductModel.countProductsFrontend(params).then((number) => {
    params.pagination.totalItems = number;
  });


  ProductModel.listProductsFrontend(params, { task: 'product-in-search' }).then((products) => {
    res.render(`${folderView}search`, {
      layout: layoutFrontend,
      pageTitle: 'search',
      products,
      params
    });
  })
});


module.exports = router;
