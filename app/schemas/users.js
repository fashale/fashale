const mongoose = require('mongoose');
const clusterConfig = require(__path_configs + 'cluster');  

var schema = new mongoose.Schema({ 
    name: String, 
    avatar: String,
    status: String,
    email: String,
    dob: Date,
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

module.exports = mongoose.model(clusterConfig.collection_users, schema);