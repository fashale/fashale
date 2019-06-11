var express = require('express');
var router = express.Router();

const ParamsHelpers = require(__path_helpers + 'params');
const FileHelpers = require(__path_helpers + 'files');
const UtilsHelpers = require(__path_helpers + 'utils');
const ProductModel = require(__path_models + 'products');
const CategoryModel = require(__path_models + 'categories');
const BrandModel = require(__path_models + 'brands');
const ValidateProduct = require(__path_validates + 'products');
const notify = require(__path_configs + 'notify');

const folderView = __path_views_backend + 'pages/products/';
const systemConfig = require(__path_configs + 'system');
const linkIndex = '/' + systemConfig.prefixBackend + '/products';

const uploadThumb = FileHelpers.upload('thumb', 'products/');


const moduleTitle = 'PHÂN HỆ QUẢN TRỊ VIÊN';
const pageTitle = 'Danh sách sản phẩm';
const pageTitleAdd = 'Thêm mới sản phẩm';
const pageTitleEdit = 'Sửa đổi sản phẩm';

router.get('(/status/:status)?', async (req, res, next) => {
  let params = {};
  params.keyword = ParamsHelpers.getParam(req.query, 'keyword', '');
  params.currentStatus = ParamsHelpers.getParam(req.params, 'status', 'all');
  let statusFilter = await UtilsHelpers.createFilterStatus(params.currentStatus, 'products');

  params.pagination = {
    totalItems: 1,
    totalItemsPerPage: 5,
    currentPage: parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
    pageRanges: 5
  }


  await ProductModel.countProducts(params).then((number) => {
    params.pagination.totalItems = number;
  });

  ProductModel.listProducts(params).then((data) => {
    //console.log(data[0].category.gender)
    res.render(`${folderView}list`, {
      moduleTitle,
      pageTitle,
      data,
      statusFilter,
      params
    });
  });
});

router.get('/change-status/:id/:status', (req, res, next) => {
  let currentStatus = ParamsHelpers.getParam(req.params, 'status', 'published');
  let id = ParamsHelpers.getParam(req.params, 'id', '');

  ProductModel.changeStatus(id, currentStatus).then(() => {
    req.flash('success', notify.CHANGE_STATUS_SUCCESS);
    res.redirect(linkIndex);
  });
});

router.get('/delete/:id', (req, res, next) => {
  let id = ParamsHelpers.getParam(req.params, 'id', '');

  ProductModel.deleteProduct(id).then(() => {
    req.flash('success', notify.DELETE_SUCCESS);
    res.redirect(linkIndex);
  });
});

router.get('/form(/:id)?', async (req, res, next) => {
  let id = ParamsHelpers.getParam(req.params, 'id', '');
  let errors = null;


  let listCategories = [];
  await CategoryModel.listCategoriesInSelectbox().then((data) => {
    listCategories = data;
    listCategories.unshift({ _id: 'novalue', name: 'Chọn loại phục trang' });
  })

  let listBrands = [];
  await BrandModel.listBrandsInSelectbox().then((data) => {
    listBrands = data;
    listBrands.unshift({ _id: 'novalue', name: 'Chọn thương hiệu' });
  })


  if (id === '') {
      let product = {
        category: {
          id: '',
          name: ''
        },
        brand: {
          id: '',
          name: ''
        }
      }
      res.render(`${folderView}form`, {
        moduleTitle,
        pageTitle: pageTitleAdd,
        product,
        errors, 
        listCategories,
        listBrands
      });
    
  } else {
    ProductModel.getProduct(id).then((product) => {
      res.render(`${folderView}form`, {
        moduleTitle,
        pageTitle: pageTitleEdit,
        product,
        errors, 
        listCategories,
        listBrands
      });
    })
  }
});

router.post('/save', (req, res, next) => {
  uploadThumb(req, res, async (errUpload) => {
    req.body = JSON.parse(JSON.stringify(req.body));
    let product = Object.assign(req.body);

    product.status = 'Hoạt động';
    product.category = {
      id: product.category_id,
      name: product.category_name,
    }
    await CategoryModel.getCategory(product.category_id).then((category) => {
      product.category.gender = category.gender;
    })
    
    product.brand = {
      id: product.brand_id,
      name: product.brand_name
    }

    let taskCurrent = (typeof product !== undefined && product.id !== "") ? "edit" : "add";

    let errors = ValidateProduct.validator(req, errUpload, taskCurrent);
    if (errors.length > 0) {
      // Có lỗi
      if (req.file != undefined) {
        FileHelpers.remove('public/uploads/products/', req.file.filename);
      }
      let listCategories = [];
      await CategoryModel.listCategoriesInSelectbox().then((data) => {
        listCategories = data;
        listCategories.unshift({ _id: 'novalue', name: 'Chọn loại phục trang' });
      })

      let listBrands = [];
      await BrandModel.listBrandsInSelectbox().then((data) => {
        listBrands = data;
        listBrands.unshift({ _id: 'novalue', name: 'Chọn thương hiệu' });
      })

      if (taskCurrent == "edit") {
        product.thumb = product.image_old;
      }
      let pageTitle = (taskCurrent == "add") ? pageTitleAdd : pageTitleEdit;
      res.render(`${folderView}form`, { 
        moduleTitle,
        pageTitle, 
        product, 
        errors, 
        listCategories,
        listBrands
      });

    } else {
      // Không có lỗi
      
      if (req.file == undefined) {
        product.thumb = product.image_old;
      } else {
        product.thumb = req.file.filename;
        if (taskCurrent == "edit") {
          FileHelpers.remove('public/uploads/products/', product.image_old);
        }
      }

      let message = (taskCurrent == "add") ? notify.ADD_SUCCESS : notify.EDIT_SUCCESS;
      ProductModel.saveProduct(product, req.user, { task: taskCurrent }).then(() => {
        req.flash('success', message);
        res.redirect(linkIndex);
      });
    }
  });
});

module.exports = router;