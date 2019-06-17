var express = require('express');
var router = express.Router();


const ParamsHelpers = require(__path_helpers + 'params');
const BillModel = require(__path_models + 'bills');
const ProductModel = require(__path_models + 'products');


const folderView = __path_views_backend + 'pages/statistics/';


const moduleTitle = 'PHÂN HỆ QUẢN TRỊ VIÊN';
const pageTitle = 'Thống kê';

router.get('/', async (req, res, next) => {
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
                statistics[index].price += product.price;
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
    await ProductModel.listProductsFrontend({ array_id: list_id }, { task: 'product-in-statistics'}).then((items) => {
        products_choose = items;
    })

    
    await list_id.forEach((id) => {
        for (let i = 0; i < products_choose.length; i++) {
            if (products_choose[i].id == id) {
                statistics[i].category = products_choose[i].category.name;
                statistics[i].brand = products_choose[i].brand.name;
                statistics[i].size = products_choose[i].size;
            }
        }
    })

    let name_1 = "", name_2 = "";
    let number_1 = "";
    let price_2 = "";
    
    let statistics_1 = statistics.sort(function(a, b){return b.number_buy-a.number_buy}).slice(0,10);
    let statistics_2 = statistics.sort(function(a, b){return b.price-a.price}).slice(0,10);
    statistics_1.forEach((item) => {
        name_1 += item.name + '-' + item.size + '-' + item.brand + ',';
        number_1 += item.number_buy + ',';
    })
    statistics_2.forEach((item) => {
        name_2 += item.name + '-' + item.size + '-' + item.brand + ',';
        price_2 += item.price + ',';
    })

    res.render(`${folderView}list`, {
        moduleTitle,
        pageTitle,
        statistics,
        name_1: name_1.slice(0,-1),
        number_1: number_1.slice(0,-1),
        name_2: name_2.slice(0,-1),
        price_2: price_2.slice(0,-1)
    })
})



module.exports = router;