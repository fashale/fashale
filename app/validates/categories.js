const util = require('util');
const notify = require(__path_configs + 'notify');


const options = {
    name: { min: 1, max: 50 },
    gender: { value: 'novalue' },
    status: { value: 'novalue' }
}


module.exports = {
    validator: (req) => {
        req.checkBody('name', util.format(notify.ERROR_NAME, options.name.min, options.name.max)).isLength({ min: options.name.min, max: options.name.max });
        req.checkBody('gender', notify.ERROR_GENDER).isNotEqual(options.status.value);
        req.checkBody('status', notify.ERROR_STATUS).isNotEqual(options.status.value);
        let errors = (req.validationErrors() !== false) ? req.validationErrors() : [];
        return errors;
    }
}