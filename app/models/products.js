const ParamsHelpers = require(__path_helpers + 'params');
const ProductModel = require(__path_schemas + 'products');
const FileHelpers = require(__path_helpers + 'files');
const StringHelpers = require(__path_helpers + 'strings');
const uploadFolder = 'public/uploads/products/';


module.exports = {
    listProducts: (params, options = null) => {
        let objWhere = {};
        if (params.category != undefined) objWhere.category = params.category;
        if (params.brand != undefined) objWhere.brand = params.brand;
        if (params.currentStatus !== 'all') objWhere.status = StringHelpers.translate(params.currentStatus);
        if (params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');


        return ProductModel
                .find(objWhere)
                .sort({'created.time': 'desc'})
                .skip((params.pagination.currentPage-1)*(params.pagination.totalItemsPerPage))
                .limit(params.pagination.totalItemsPerPage);
    },

    countProducts: (params, options = null) => {
        let objWhere = {};
        if (params.category != undefined) objWhere.category = params.category;
        if (params.brand != undefined) objWhere.brand = params.brand;
        if (params.currentStatus !== 'all') objWhere.status = StringHelpers.translate(params.currentStatus);
        if (params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');
        return ProductModel.countDocuments(objWhere);
    },

    countProductsFrontend: (params, options = null) => {
        let keyword = '';
        if (params.keyword !== '') keyword = new RegExp(params.keyword, 'i');
        if (keyword != '') {
            return ProductModel.countDocuments({status: 'Hoạt động', $or: [{name: keyword}, {summary: keyword}, {content: keyword}] });
        } else if (options == 'categories') {
            return ProductModel.countDocuments({status: 'Hoạt động', 'category.id': params.id });
        } else if (options == 'brands') {
            return ProductModel.countDocuments({status: 'Hoạt động', 'brand.id': params.id });
        } else {
            return ProductModel.countDocuments({status: 'Hoạt động'});
        }
    },

    listProductsFrontend: (params = null, options = null) => {
        if (options.task == 'product-in-id-array') {
            return ProductModel.find({status: 'Hoạt động', _id: { $in: params.array_id }});
        }

        if (options.task == 'product-in-bill-history') {
            return ProductModel.find({_id: { $in: params.array_id }});
        }

        if (options.task == 'product-in-statistics') {
            return ProductModel.find({_id: { $in: params.array_id }});
        }

        if (options.task == 'product-new') {
            return ProductModel.find({status: 'Hoạt động'})
                        .sort({'created.time': 'desc'})
                        .limit(20);
        }

        if (options.task == 'product-most-views') {
            return ProductModel.find({status: 'Hoạt động' })
                        .sort({views: 'desc'})
                        .limit(10);
        }
        
        if (options.task == 'product-new-in-category') {
            return ProductModel.find({status: 'Hoạt động', 'category.id': params.id})
                        .sort({'created.time': 'desc'})
                        .skip((params.pagination.currentPage-1)*(params.pagination.totalItemsPerPage))
                        .limit(params.pagination.totalItemsPerPage);
        }

        if (options.task == 'product-price-in-category') {
            return ProductModel.find({status: 'Hoạt động', 'category.id': params.id})
                        .sort({price: 'desc'})
                        .skip((params.pagination.currentPage-1)*(params.pagination.totalItemsPerPage))
                        .limit(params.pagination.totalItemsPerPage);
        }

        if (options.task == 'product-view-in-category') {
            return ProductModel.find({status: 'Hoạt động', 'category.id': params.id})
                        .sort({views: 'desc'})
                        .skip((params.pagination.currentPage-1)*(params.pagination.totalItemsPerPage))
                        .limit(params.pagination.totalItemsPerPage);
        }

        if (options.task == 'product-new-in-brand') {
            return ProductModel.find({status: 'Hoạt động', 'brand.id': params.id})
                        .sort({'created.time': 'desc'})
                        .skip((params.pagination.currentPage-1)*(params.pagination.totalItemsPerPage))
                        .limit(params.pagination.totalItemsPerPage);
        }

        if (options.task == 'product-price-in-brand') {
            return ProductModel.find({status: 'Hoạt động', 'brand.id': params.id})
                        .sort({price: 'desc'})
                        .skip((params.pagination.currentPage-1)*(params.pagination.totalItemsPerPage))
                        .limit(params.pagination.totalItemsPerPage);
        }

        if (options.task == 'product-view-in-brand') {
            return ProductModel.find({status: 'Hoạt động', 'brand.id': params.id})
                        .sort({views: 'desc'})
                        .skip((params.pagination.currentPage-1)*(params.pagination.totalItemsPerPage))
                        .limit(params.pagination.totalItemsPerPage);
        }

        if (options.task == 'product') {
            return ProductModel.find({status: 'Hoạt động'})
                        .sort({'created.time': 'desc'});
        }


        if (options.task == 'product-detail') {
            return ProductModel.find({status: 'Hoạt động', _id: params.id })
                        .limit(1);
        }


        if (options.task == 'product-random-in-category') {
            return ProductModel.aggregate([
                { $match: { status: 'Hoạt động', 'category.id': params.id}},
                { $sample: {size: 5}}
            ]);
        }

        if (options.task == 'product-random-in-brand') {
            return ProductModel.aggregate([
                { $match: { status: 'Hoạt động', 'brand.id': params.id}},
                { $sample: {size: 5}}
            ]);
        }

        if (options.task == 'product-new-in-search') {
            let keyword = new RegExp(params.keyword, 'i');
            return ProductModel.find({status: 'Hoạt động', $or: [{name: keyword}, {summary: keyword}, {content: keyword}] })
                        .sort({'created.time': 'desc'})
                        .skip((params.pagination.currentPage-1)*(params.pagination.totalItemsPerPage))
                        .limit(params.pagination.totalItemsPerPage)
        }

        if (options.task == 'product-price-in-search') {
            let keyword = new RegExp(params.keyword, 'i');
            return ProductModel.find({status: 'Hoạt động', $or: [{name: keyword}, {summary: keyword}, {content: keyword}] })
                        .sort({price: 'desc'})
                        .skip((params.pagination.currentPage-1)*(params.pagination.totalItemsPerPage))
                        .limit(params.pagination.totalItemsPerPage);
        }

        if (options.task == 'product-view-in-search') {
            let keyword = new RegExp(params.keyword, 'i');
            return ProductModel.find({status: 'Hoạt động', $or: [{name: keyword}, {summary: keyword}, {content: keyword}] })
                        .sort({views: 'desc'})
                        .skip((params.pagination.currentPage-1)*(params.pagination.totalItemsPerPage))
                        .limit(params.pagination.totalItemsPerPage);
        }
    },

    getProduct: (id) => {
        return ProductModel.findById(id);
    },

    changeStatus: (id, currentStatus) => {
        let status = (currentStatus === "active") ? "Không hoạt động" : "Hoạt động";
        let data = {
            status
        }
        return ProductModel.updateOne({_id: id}, data);
    },

    deleteProduct: async (id) => {
        await ProductModel.findById(id).then((product) => {
            FileHelpers.remove(uploadFolder, product.thumb);
        });
        return ProductModel.deleteOne({_id: id});
    },

    addComment: (idProduct, comments_product, comment, user) => {
        comment.user_name = user.name;
        comment.user_id = user.id;
        comment.user_avatar = (user.avatar == undefined) ? '' : user.avatar;
        comment.time = Date.now();
        comments_product.push(comment);
        return ProductModel.updateOne({_id: idProduct}, {
            comments: comments_product
        });
    },

    updateViews: (idProduct, views) => {
        views++;
        return ProductModel.updateOne({_id: idProduct}, {
            views: views
        });
    },

    saveProduct: (product, user, options = null) => {
        if (options.task == "add") {
            product.created = {
                user_id: user.id,
                user_name: user.name,
                time: Date.now()
            }
            product.number_remain = product.number_sell;
            return new ProductModel(product).save();
        }
        if (options.task == "edit") {
            return ProductModel.updateOne({_id: product.id}, {
                name: product.name,
                thumb: product.thumb,
                category: product.category,
                brand: product.brand,
                status: product.status,
                size: product.size,
                price: product.price,
                promotion: product.promotion,
                number_sell: product.number_sell,
                number_remain: product.number_sell,
                summary: product.summary,
                content: product.content,
                modified: {
                    user_id: user.id,
                    user_name: user.name,
                    time: Date.now()
                }
            });
        }
        if (options.task == "edit-number-remain") {
            return ProductModel.updateOne({_id: product.id}, {
                status: (product.status == "Không hoạt động") ? product.status : 'Hoạt động',
                number_remain: product.number_remain
            });
        }
    }
}