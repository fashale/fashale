const ParamsHelpers = require(__path_helpers + 'params');
const StringHelpers = require(__path_helpers + 'strings');
const UserModel = require(__path_schemas + 'users');
const uploadFolder = 'public/uploads/users/';



module.exports = {
    listUsers: (params) => {
        let objWhere = {};
        if (params.currentStatus !== 'all') objWhere.status = StringHelpers.translate(params.currentStatus);
        if (params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');
        return UserModel
            .find(objWhere)
            .skip((params.pagination.currentPage - 1) * (params.pagination.totalItemsPerPage))
            .limit(params.pagination.totalItemsPerPage);
    },

    getUser: (id) => {
        return UserModel.findById(id);
    },

    countUsers: (params) => {
        let objWhere = {};
        if (params.currentStatus !== 'all') objWhere.status = StringHelpers.translate(params.currentStatus);
        if (params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');
        return UserModel.countDocuments(objWhere);
    },

    getUserByEmail: (email) => {
        return UserModel
            .find({ status: 'Hoạt động', email: email })
            .select('id name email password')
    },

    getAllUsersByEmail: (email) => {
        return UserModel
            .find({email: email })
    },

    getUserByEmailForgetPassword: (email) => {
        return UserModel
            .find({ email: email })
            .select('name email password')
    },

    getUserByEmailChangePassword: (email) => {
        return UserModel
            .find({ email: email })
            .select('name email password')
    },

    changeStatus: (id, currentStatus) => {
        let status = (currentStatus === "active") ? "Không hoạt động" : "Hoạt động";
        let data = {
            status
        }
        return UserModel.updateOne({ _id: id }, data);
    },

    deleteUser: async (id) => {
        await UserModel.findById(id).then((user) => {
            FileHelpers.remove(uploadFolder, user.avatar);
        });
        return UserModel.deleteOne({ _id: id });
    },

    saveUser: (user, options = null) => {
        if (options.task == "add") {
            user.status = 'Hoạt động';
            return new UserModel(user).save();
        }
        if (options.task == "edit") {
            return UserModel.updateOne({ _id: user.id }, {
                status: (user.status == 'active') ? 'Hoạt động' : 'Không hoạt động',
            });
        }
        if (options.task == "edit-password") {
            return UserModel.updateOne({ _id: user.id }, {
                password: user.password
            });
        }
        if (options.task == "edit-info") {
            return UserModel.updateOne({ _id: user.id }, {
                avatar: user.avatar,
                name: user.name,
                email: user.email,
                dob: user.dob
            });
        }
    }
}