module.exports = {
    createFilterStatus: async (currentStatus, collection, options = null) => {
        const Model = require(__path_schemas + collection);
        let filter = [];
        if (collection != 'bills') {
            filter = [
                { name: 'Tất cả', value: 'all', count: 0, class: 'default' },
                { name: 'Hoạt động', value: 'active', count: 0, class: 'default' },
                { name: 'Không hoạt động', value: 'inactive', count: 0, class: 'default' }
            ];

            for (let index = 0; index < filter.length; index++) {
                let item = filter[index];
                let condition = (item.value !== "all") ? { status: item.name } : {};
                if (item.value === currentStatus) filter[index].class = 'success';
                await Model.countDocuments(condition).then((number) => {
                    filter[index].count = number;
                });
            };
        } else {
            if (options == null) {
                filter = [
                    { name: 'Tất cả', value: 'all', count: 0, class: 'default' },
                    { name: 'Chưa giao hàng', value: 'not-delivery', count: 0, class: 'default' },
                    { name: 'Đang giao hàng', value: 'delivery', count: 0, class: 'default' },
                    { name: 'Đã giao hàng', value: 'delivered', count: 0, class: 'default' },
                    { name: 'Bị hủy đơn hàng', value: 'canceled', count: 0, class: 'default' }
                ];

                for (let index = 0; index < filter.length; index++) {
                    let item = filter[index];
                    let condition = (item.value !== "all") ? { status: item.name } : {};
                    if (item.value === currentStatus) filter[index].class = 'success';
                    await Model.countDocuments(condition).then((number) => {
                        filter[index].count = number;
                    });
                };
            } else {
                filter = [
                    { name: 'Chưa', value: 'not-delivery', class: 'default' },
                    { name: 'Đang', value: 'delivery', class: 'default' },
                    { name: 'Đã', value: 'delivered', class: 'default' },
                    { name: 'Hủy', value: 'canceled', class: 'default' }
                ];

                for (let index = 0; index < filter.length; index++) {
                    if (filter[index].value === currentStatus) filter[index].class = 'success';
                };
            }
        }

        
        return filter;
        
    }
}