const mongoose = require('mongoose');
const clusterConfig = require(__path_configs + 'cluster');  

var schema = new mongoose.Schema({ 
    name: String, 
    thumb: String,
    category: {
        id: String,
        name: String,
        gender: String
    },
    brand: {
        id: String,
        name: String
    },
    status: String,
    size: String,
    price: Number,
    promotion: String,
    number_sell: Number,
    number_remain: Number,
    summary: String,
    content: String,
    created: {
        user_id: String,
        user_name: String,
        time: Date
    },
    modified: {
        user_id: String,
        user_name: String,
        time: Date
    },
    comments: [{
        user_avatar: String,
        user_id: String,
        user_name: String,
        content: String,
        time: Date
    }],
    views: Number
});

module.exports = mongoose.model(clusterConfig.collection_products, schema);