const CategoryModel = require(__path_schemas + 'categories');

module.exports = {
    listCategories: () => {
        let objWhere = {};
        return CategoryModel
                .find(objWhere)
    },

    listCategoriesInSelectbox: (params = null) => {
        let objWhere = {
            status: 'Hoạt động'
        };
        if (params != null) objWhere.gender = params.gender;
        return CategoryModel.find(objWhere, {_id: 1, name: 1});
    },

    getCategory: (id) => {
        return CategoryModel.findById(id);
    },

    changeStatus: (id, currentStatus) => {
        let status = (currentStatus === "active") ? "Không hoạt động" : "Hoạt động";
        let data = {
            status
        }
        return CategoryModel.updateOne({_id: id}, data);
    },

    deleteCategory: (id) => {
        return CategoryModel.deleteOne({_id: id});
    },

    saveCategory: (category) => {
        let data = {
            name: category.name,
            gender: category.gender,
            status: (category.status === "active") ? "Hoạt động" : "Không hoạt động"
        }
        return new CategoryModel(data).save();
    }
}