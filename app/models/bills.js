const BillModel = require(__path_schemas + 'bills');
const StringHelpers = require(__path_helpers + 'strings');


module.exports = {
    listBills: (params) => {
        let objWhere = {};
        if (params.currentStatus !== 'all') objWhere.status = StringHelpers.translate_bill(params.currentStatus); 
        let keyword = new RegExp(params.keyword, 'i');
        if (params.keyword !== '') objWhere.$or = [{'customer.name': keyword}, {address: keyword}];
        return BillModel
            .find(objWhere)
            .skip((params.pagination.currentPage - 1) * (params.pagination.totalItemsPerPage))
            .limit(params.pagination.totalItemsPerPage);
    },

    listAllBillsDelivered: () => {
        return BillModel
            .find({ status: 'Đã giao hàng' });
    },

    getBill: (id) => {
        return BillModel.findById(id);
    },

    countBills: (params) => {
        let objWhere = {};
        if (params.currentStatus !== 'all') objWhere.status = StringHelpers.translate_bill(params.currentStatus);
        let keyword = new RegExp(params.keyword, 'i');
        if (params.keyword !== '') objWhere.$or = [{'customer.name': keyword}, {address: keyword}];
        return BillModel.countDocuments(objWhere);
    },

    listBillsFrontend: (params, options = null) => {
        return BillModel
            .find({'customer.id': params.id })
            .sort({ time: 'desc' });
    },

    changeStatus: (id, newStatus) => {
        let data = {
            status: newStatus
        }
        return BillModel.updateOne({ _id: id }, data);
    },

    cancelBill: (id) => {
        let data = {
            status: 'Bị hủy đơn hàng'
        }
        return BillModel.updateOne({ _id: id }, data);
    },

    deleteBill: async (id) => {
        return BillModel.deleteOne({ _id: id });
    },

    saveBill: (cart, user, options = null) => {
        if (options.task == "add") {
            bill = {
                time: Date.now(),
                address: cart.address,
                status: 'Chưa giao hàng',
                customer: {
                    id: user.id,
                    name: user.name
                },
                products: cart.products,
                total_buy: cart.total_buy,
                delivery_charge: cart.delivery_charge,
                total_payment: cart.total_payment
            }
            return new BillModel(bill).save();
        }
        /*if (options.task == "edit") {
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
        }*/
    }
}