var express = require('express');
var router = express.Router();

const ProductModel = require(__path_models + 'products');
const BillModel = require(__path_models + 'bills');
const UserModel = require(__path_models + 'users');
const StringHelpers = require(__path_helpers + 'strings');
const ParamsHelpers = require(__path_helpers + 'params');
const systemConfig = require(__path_configs + 'system');

const folderView = __path_views_frontend + 'pages/bills/';
const layoutFrontend = __path_views_frontend + 'frontend';

const linkIndex = StringHelpers.formatLink('/' + systemConfig.prefixFrontend + '/bills/cart');

const pageTitle = 'bills';

var request = require("request")


router.get('/cart', async (req, res, next) => {
    let params = {};
    let products_choose = [];
    let productsChoose = [];
    let max = [];
    if (req.session.products_choose_id == undefined) req.session.products_choose_id =[];
    if (req.session.list_number == undefined) req.session.list_number = [];
    if (req.session.address == undefined) req.session.address = '';
    params.array_id = req.session.products_choose_id;
    await ProductModel.listProductsFrontend(params, { task: 'product-in-id-array' }).then((products) => {
        products_choose = products
    })
    await params.array_id.forEach((id) => {
        for (let i = 0; i < products_choose.length; i++) {
            if (products_choose[i].id == id) {
                productsChoose.push(products_choose[i]);
            }
        }
    })

    let list_number = (req.session.list_number != undefined) ? req.session.list_number : [];
    let list_number_length = list_number.length;
    let productsChoose_length = productsChoose.length;
    for (let i = 0; i < productsChoose_length; i++) {
        max[i] = productsChoose[i].number_remain;
        if (list_number[i] > max[i]) {
            list_number[i] = max[i];
        }
    }
    if (list_number_length < productsChoose_length) {
        let n = productsChoose_length - list_number_length;
        for (let i = 0; i < n; i++) {
            list_number.push('1');
        }
    }



    let distance = '';
    let address = '';
    let money_ship = 0;
    if (req.session.address != '' && req.session.address != undefined) {
        var url = encodeURI('https://maps.googleapis.com/maps/api/directions/json?origin=' + systemConfig.store_address + '&destination=' + req.session.address + '&key=' + systemConfig.api_key);
        request({
            url: url,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                distance = body.routes[0].legs[0].distance.text;
                address = req.session.address;
                money_ship = parseFloat(distance) * 5000;
            }
            res.render(`${folderView}cart`, {
                layout: layoutFrontend,
                pageTitle: 'cart',
                productsChoose,
                distance,
                address,
                money_ship,
                list_number,
                max
            });
        })
    } else {
        res.render(`${folderView}cart`, {
            layout: layoutFrontend,
            pageTitle: 'cart',
            productsChoose,
            distance,
            address,
            money_ship,
            list_number,
            max
        });
    }
});

router.get('/cart/delete/:id', (req, res, next) => {
    let id = ParamsHelpers.getParam(req.params, 'id', '');
    var index = req.session.products_choose_id.indexOf(id);
    if (index > -1) {
        req.session.products_choose_id.splice(index, 1);
        req.session.list_number.splice(index, 1);
    }
    res.redirect(linkIndex);
})

router.post('/cart/address', (req, res, next) => {
    req.body = JSON.parse(JSON.stringify(req.body));
    let item = Object.assign(req.body);
    req.session.address = (item.address == undefined) ? '' : item.address;
    req.session.list_number = item.list_number.split(',');
    res.redirect(linkIndex);
})

router.post('/save', async (req, res, next) => {
    req.body = JSON.parse(JSON.stringify(req.body));
    let item = Object.assign(req.body);
    let list_number = item.list_number.split(',');
    item.products = [];

    let params = {};
    params.array_id = req.session.products_choose_id;
    await ProductModel.listProductsFrontend(params, { task: 'product-in-id-array' }).then((products) => {
        products_choose = products
    })
    await params.array_id.forEach((id, index) => {
        for (let i = 0; i < products_choose.length; i++) {
            if (products_choose[i].id == id) {
                let product = {
                    id: products_choose[i].id,
                    name: products_choose[i].name,
                    thumb: products_choose[i].thumb,
                    price: products_choose[i].price,
                    number_buy: parseInt(list_number[index]),
                }
                item.products.push(product);
                product.number_remain = products_choose[i].number_remain - parseInt(list_number[index])
                if (product.number_remain <= 0) {
                    product.status = "Không hoạt động";
                }

                ProductModel.saveProduct(product, null, { task: 'edit-number-remain' }).then(() => { })
            }
        }
    })

    req.session.products_choose_id = [];
    req.session.list_number = [];
    req.session.address = [];

    await BillModel.saveBill(item, req.user, { task: 'add' }).then(() => {
        res.redirect(linkIndex)
    })
})


module.exports = router;