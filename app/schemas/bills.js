const mongoose = require('mongoose');
const clusterConfig = require(__path_configs + 'cluster');  

var schema = new mongoose.Schema({ 
    time: Date,
    address: String, 
    status: String,
    customer: {
        id: String,
        name: String
    },
    products: [{
        id: String,
        name: String,
        thumb: String,
        price: Number,
        number_buy: Number
    }],
    total_buy: Number,
    delivery_charge: Number,
    total_payment: Number
});

module.exports = mongoose.model(clusterConfig.collection_bills, schema);