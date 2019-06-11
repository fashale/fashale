const CategoryModel = require(__path_models + 'categories');

module.exports = async (req, res, next) => {
    let listMaleCategories = {};
    let listFemaleCategories = {};
    await CategoryModel.listCategoriesInSelectbox({ gender: 'Nam' }).then((categories) => {
        listMaleCategories = categories;
    })
    await CategoryModel.listCategoriesInSelectbox({ gender: 'Nữ' }).then((categories) => {
        listFemaleCategories = categories;
    })
    res.locals.listMaleCategories = listMaleCategories;
    res.locals.listFemaleCategories = listFemaleCategories;
    next();
}