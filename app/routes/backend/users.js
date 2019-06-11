var express = require('express');
var router = express.Router();

const ParamsHelpers = require(__path_helpers + 'params');
const UtilsHelpers = require(__path_helpers + 'utils');
const UserModel = require(__path_models + 'users');
const notify = require(__path_configs + 'notify');

const folderView = __path_views_backend + 'pages/users/';
const systemConfig = require(__path_configs + 'system');
const linkIndex = '/' + systemConfig.prefixBackend + '/users';


const moduleTitle = 'PHÂN HỆ QUẢN TRỊ VIÊN';
const pageTitle = 'Danh sách người dùng';


router.get('(/status/:status)?', async (req, res, next) => {
  let params = {};
  params.keyword = ParamsHelpers.getParam(req.query, 'keyword', '');
  params.currentStatus = ParamsHelpers.getParam(req.params, 'status', 'all');
  let statusFilter = await UtilsHelpers.createFilterStatus(params.currentStatus, 'users');

  params.pagination = {
    totalItems: 1,
    totalItemsPerPage: 5,
    currentPage: parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
    pageRanges: 5
  }

  await UserModel.countUsers(params).then((number) => {
    params.pagination.totalItems = number;
  });

  UserModel.listUsers(params).then((data) => {
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
  let currentStatus = ParamsHelpers.getParam(req.params, 'status', 'active');
  let id = ParamsHelpers.getParam(req.params, 'id', '');

  UserModel.changeStatus(id, currentStatus).then(() => {
    req.flash('success', notify.CHANGE_STATUS_SUCCESS);
    res.redirect(linkIndex);
  });
});


router.get('/delete/:id', (req, res, next) => {
  let id = ParamsHelpers.getParam(req.params, 'id', '');

  UserModel.deleteUser(id).then(() => {
    req.flash('success', notify.DELETE_SUCCESS);
    res.redirect(linkIndex);
  });
});


module.exports = router;