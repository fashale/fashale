const ParamsHelpers = require(__path_helpers + 'params');
const BillModel = require(__path_schemas + 'bills');
const StringHelpers = require(__path_helpers + 'strings');


module.exports = {
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