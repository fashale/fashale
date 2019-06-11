const StringHelpers = require(__path_helpers + 'strings');
const systemConfig = require(__path_configs + 'system');
const UserModel = require(__path_models + 'users');
const linkLogin = StringHelpers.formatLink('/' + systemConfig.prefixFrontend + `/auth/login/`);
const linkNoPermission = StringHelpers.formatLink('/' + systemConfig.prefixFrontend + `/auth/no-permission/`);


module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        UserModel.getUser(req.user.id).then((user) => {
            if (user.status == "Hoạt động") {
                next();
            } else {
                res.redirect(linkNoPermission);
            }
        })
    } else {
        res.redirect(linkLogin);
    }
}