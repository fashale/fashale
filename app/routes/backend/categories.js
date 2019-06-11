var express = require('express');
var router = express.Router();


const ParamsHelpers = require(__path_helpers + 'params');
const ValidateCategory = require(__path_validates + 'categories');
const CategoryModel = require(__path_models + 'categories');
const notify = require(__path_configs + 'notify');

const folderView = __path_views_backend + 'pages/categories/';
const systemConfig = require(__path_configs + 'system');
const linkIndex = '/' + systemConfig.prefixBackend + '/categories/';


const moduleTitle = 'PHÂN HỆ QUẢN TRỊ VIÊN';
const pageTitle = 'Danh sách loại phục trang';
const pageTitleAdd = 'Thêm mới loại phục trang';

router.get('(/status/:status)?', (req, res, next) => {

    CategoryModel.listCategories().then((data) => {
        res.render(`${folderView}list`, {
            moduleTitle,
            pageTitle,
            data
        })
    })
})

router.get('/change-status/:id/:status', (req, res, next) => {
    let currentStatus = ParamsHelpers.getParam(req.params, 'status', 'active');
    let id = ParamsHelpers.getParam(req.params, 'id', '');
    CategoryModel.changeStatus(id, currentStatus).then(() => {
      req.flash('success', notify.CHANGE_STATUS_SUCCESS);
      res.redirect(linkIndex);
    })
})

router.get('/delete/:id', (req, res, next) => {
    let id = ParamsHelpers.getParam(req.params, 'id', '');
    
    CategoryModel.deleteCategory(id).then(() => {
      req.flash('success', notify.DELETE_SUCCESS);
      res.redirect(linkIndex);
    })
})

router.get('/form', (req, res, next) => {
    res.render(`${folderView}form`, { 
        moduleTitle,
        pageTitle: pageTitleAdd,
        errors: null,
        category: { name: '', status: 'novalue' }
    })
})

router.post('/save', (req, res, next) => {
    req.body = JSON.parse(JSON.stringify(req.body));
    ValidateCategory.validator(req);
    let category = Object.assign(req.body);
    let errors = req.validationErrors();

    if (errors.length > 0) {
        res.render(`${folderView}form`, { 
            moduleTitle,
            pageTitle: pageTitleAdd, 
            category, 
            errors
        });
    } else {
        CategoryModel.saveCategory(category).then(() => {
            req.flash('success', notify.ADD_SUCCESS);
            res.redirect(linkIndex);  
        });
    }
});

module.exports = router;