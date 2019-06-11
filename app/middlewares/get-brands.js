const BrandModel = require(__path_models + 'brands');

module.exports = async (req, res, next) => {
    let listBrands = {};
    await BrandModel.listBrandsInSelectbox().then((brands) => {
        listBrands = brands;
    })
    res.locals.listBrands = listBrands;
    next();
}