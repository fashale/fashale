var express = require('express');
var router = express.Router();


const ParamsHelpers = require(__path_helpers + 'params');
const ValidateBrand = require(__path_validates + 'brands');
const BrandModel = require(__path_models + 'brands');
const notify = require(__path_configs + 'notify');

const folderView = __path_views_backend + 'pages/brands/';
const systemConfig = require(__path_configs + 'system');
const linkIndex = '/' + systemConfig.prefixBackend + '/brands/';


const moduleTitle = 'PHÂN HỆ QUẢN TRỊ VIÊN';
const pageTitle = 'Danh sách thương hiệu';
const pageTitleAdd = 'Thêm mới thương hiệu';

router.get('(/status/:status)?', (req, res, next) => {
    let params = {};

    BrandModel.listBrands().then((data) => {
        res.render(`${folderView}list`, {
            moduleTitle,
            pageTitle,
            data,
            params
        })
    })
})

router.get('/change-status/:id/:status', (req, res, next) => {
    let currentStatus = ParamsHelpers.getParam(req.params, 'status', 'active');
    let id = ParamsHelpers.getParam(req.params, 'id', '');
    BrandModel.changeStatus(id, currentStatus).then(() => {
      req.flash('success', notify.CHANGE_STATUS_SUCCESS);
      res.redirect(linkIndex);
    })
})

router.get('/delete/:id', (req, res, next) => {
    let id = ParamsHelpers.getParam(req.params, 'id', '');
    
    BrandModel.deleteBrand(id).then(() => {
      req.flash('success', notify.DELETE_SUCCESS);
      res.redirect(linkIndex);
    })
})

router.get('/form', (req, res, next) => {
    res.render(`${folderView}form`, { 
        moduleTitle,
        pageTitle: pageTitleAdd,
        brand: { name: '', status: 'novalue' },
        errors: null
    })
})

router.post('/save', (req, res, next) => {
    req.body = JSON.parse(JSON.stringify(req.body));
    ValidateBrand.validator(req);
    let brand = Object.assign(req.body);
    let errors = req.validationErrors();


    if (errors.length > 0) {
        res.render(`${folderView}form`, { 
            moduleTitle,
            pageTitle: pageTitleAdd, 
            brand, 
            errors
        });
    } else {
        BrandModel.saveBrand(brand).then(() => {
            req.flash('success', notify.ADD_SUCCESS);
            res.redirect(linkIndex);  
        });
    }
});

module.exports = router;