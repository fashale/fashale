const BrandModel = require(__path_schemas + 'brands');

module.exports = {
    listBrands: () => {
        let objWhere = {};
      
        return BrandModel
                .find(objWhere)
    },

    listBrandsInSelectbox: () => {
        return BrandModel.find({}, {_id: 1, name: 1});
    },

    countBrands: (params) => {
        let objWhere = { name: params.name };
        return BrandModel.countDocuments(objWhere);
    },

    changeStatus: (id, currentStatus) => {
        let status = (currentStatus === "active") ? "Không hoạt động" : "Hoạt động";
        let data = {
            status
        }
        return BrandModel.updateOne({_id: id}, data);
    },

    deleteBrand: (id) => {
        return BrandModel.deleteOne({_id: id});
    },

    saveBrand: (brand) => {
        let data = {
            name: brand.name,
            status: (brand.status === "active") ? "Hoạt động" : "Không hoạt động"
        }
        return new BrandModel(data).save();
    }
}