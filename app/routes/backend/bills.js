var express = require('express');
var router = express.Router();

const ParamsHelpers = require(__path_helpers + 'params');
const StringHelpers = require(__path_helpers + 'strings');
const UtilsHelpers = require(__path_helpers + 'utils');
const BillModel = require(__path_models + 'bills');
const notify = require(__path_configs + 'notify');

const folderView = __path_views_backend + 'pages/bills/';
const systemConfig = require(__path_configs + 'system');
const linkIndex = '/' + systemConfig.prefixBackend + '/bills';


const moduleTitle = 'PHÂN HỆ QUẢN TRỊ VIÊN';
const pageTitle = 'Danh sách đơn hàng';


router.get('(/status/:status)?', async (req, res, next) => {
  let params = {};
  params.keyword = ParamsHelpers.getParam(req.query, 'keyword', '');
  params.currentStatus = ParamsHelpers.getParam(req.params, 'status', 'all');
  let statusFilter = await UtilsHelpers.createFilterStatus(params.currentStatus, 'bills');

  params.pagination = {
    totalItems: 1,
    totalItemsPerPage: 5,
    currentPage: parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
    pageRanges: 5
  }

  await BillModel.countBills(params).then((number) => {
    params.pagination.totalItems = number;
  });

  BillModel.listBills(params).then((data) => {
    res.render(`${folderView}list`, {
      moduleTitle,
      pageTitle,
      data,
      statusFilter,
      params
    });
  });
});

router.get('/change-status/:id/:new_status', (req, res, next) => {
  let newStatus = ParamsHelpers.getParam(req.params, 'new_status', 'not_delivery');
  newStatus = StringHelpers.translate_bill(newStatus);
  let id = ParamsHelpers.getParam(req.params, 'id', '');

  BillModel.changeStatus(id, newStatus).then(() => {
    req.flash('success', notify.CHANGE_STATUS_SUCCESS);
    res.redirect(linkIndex);
  });
});


module.exports = router;