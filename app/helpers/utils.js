module.exports = {
    createFilterStatus: async (currentStatus, collection, options = null) => {
        const Model = require(__path_schemas + collection);
        if (collection != 'bills') {
            let filter = [
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
            return filter;
        } else {
            let filter = [];
            // Xử lý...
            return filter;
        }
        
    }
}