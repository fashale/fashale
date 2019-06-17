var express = require('express');
var router = express.Router();

const ProductModel = require(__path_models + 'products');
const CategoryModel = require(__path_models + 'categories');
const BrandModel = require(__path_models + 'brands');
const BillModel = require(__path_models + 'bills');
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
  await ProductModel.listProductsFrontend(params, { task: 'product-most-views' }).then((products) => {
    productsMostViews = products;
  });

  let productsNew = [];
  await ProductModel.listProductsFrontend(params, { task: 'product-new' }).then((products) => {
    productsNew = products;
  });

  let productsAllPublish = [];
  await ProductModel.listProductsFrontend(params, { task: 'product' }).then((products) => {
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

  // Tìm sản phẩm bán chạy

  let statistics = [];
  let list_id = [];
  await BillModel.listAllBillsDelivered().then((data) => {
    let products = [];
    data.forEach((bill) => {
      bill.products.forEach((product) => {
        products.push(product);
      })
    })
    products.forEach((product) => {
      if (list_id.includes(product.id)) {
        let index = list_id.indexOf(product.id);
        statistics[index].number_buy += product.number_buy;
      } else {
        list_id.push(product.id);
        let statistic = {
          name: product.name,
          price: product.price,
          number_buy: product.number_buy
        }
        statistics.push(statistic)
      }
    })
  })

  let products_choose = [];
  await ProductModel.listProductsFrontend({ array_id: list_id }, { task: 'product-in-statistics' }).then((items) => {
    products_choose = items;
  })


  await list_id.forEach((id) => {
    for (let i = 0; i < products_choose.length; i++) {
      if (products_choose[i].id == id) {
        statistics[i].category = products_choose[i].category.name;
        statistics[i].brand = products_choose[i].brand.name;
        statistics[i].size = products_choose[i].size;
        statistics[i].promotion = products_choose[i].promotion;
        statistics[i].gender = products_choose[i].category.gender;
        statistics[i].thumb = products_choose[i].thumb;
      }
    }
  })

  let productsBestSell = statistics.sort(function (a, b) { return b.number_buy - a.number_buy }).slice(0, 10);

  res.render(`${folderView}index`, {
    layout: layoutFrontend,
    pageTitle,
    productsNew,
    productsTopNewCategories,
    productsTopNewBrands,
    productsMostViews,
    productsBestSell,
    params
  });
});

router.get('/search(/:sort_type)?', async (req, res, next) => {
  let sort_type_slug = ParamsHelpers.getParam(req.params, 'sort_type', 'product-new');
  let params = {};
  params.keyword = ParamsHelpers.getParam(req.query, 'keyword', '');

  params.pagination = {
    totalItems: 1,
    totalItemsPerPage: 5,
    currentPage: parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
    pageRanges: 5
  }

  await ProductModel.countProductsFrontend(params).then((number) => {
    params.pagination.totalItems = number;
  });


  ProductModel.listProductsFrontend(params, { task: sort_type_slug + '-in-search' }).then((products) => {
    res.render(`${folderView}search`, {
      layout: layoutFrontend,
      pageTitle: 'search',
      products,
      params,
      sort_type_slug
    });
  })
});


module.exports = router;
