let concatTag = (str1, str2) => {
    let arr_tags = str1.split(',');
    let tags = (arr_tags.slice(-1) == '') ? ((arr_tags.pop() == '') ? [] : arr_tags.pop()) : arr_tags;
    let arr_old_tags = str2.split(',');
    let old_tags = (arr_old_tags.slice(-1) == '') ? ((arr_old_tags.pop() == '') ? [] : arr_old_tags.pop()) : arr_old_tags;
    return old_tags.concat(tags);
}

let translate = (str) => {
    let result = '';
    switch(str) {
        case 'active':
            result = 'Hoạt động';
            break;
        case 'inactive':
            result = 'Không hoạt động';
            break;
        default:
    }
    return result;
}

let translate_bill = (str) => {
    let result = '';
    switch(str) {
        case 'not-delivery':
            result = 'Chưa giao hàng';
            break;
        case 'delivery':
            result = 'Đang giao hàng';
            break;
        case 'delivered':
            result = 'Đã giao hàng';
            break;
        case 'canceled':
            result = 'Bị hủy đơn hàng';
            break;
        default:
    }
    return result;
}


let formatLink = (value) => {
    if (value[1]=="/") {
        value = value.substr(1);
    }
    return value;
}

let getDate = (str) => {
    let year = str.substr(11, 4);
    let month = '';
    switch (str.substr(4, 3)) {
        case 'Jan': 
            month = '01';
            break;
        case 'Feb': 
            month = '02';
            break;
        case 'Mar': 
            month = '03';
            break;
        case 'Apr': 
            month = '04';
            break;
        case 'May': 
            month = '05';
            break;
        case 'Jun': 
            month = '06';
            break;
        case 'Jul': 
            month = '07';
            break;
        case 'Aug': 
            month = '08';
            break;
        case 'Sep': 
            month = '09';
            break;
        case 'Oct': 
            month = '10';
            break;
        case 'Nov': 
            month = '11';
            break;
        case 'Dec': 
            month = '12';
            break;
        default:
    }
    let day = str.substr(8, 2);
    let date = year + "-" + month + "-" + day;
    return date;
}

let getDateTime = (str) => {
    let date = getDate(str);
    let time = str.substr(16,8);
    return time + " " + date;
}

let createSlug = (value) => {
    var str = value;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ấ|ầ|ẩ|ẫ|ậ|ă|ắ|ằ|ẳ|ẵ|ặ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ế|ề|ể|ễ|ệ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ứ|ừ|ử|ữ|ự/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.replace(/ *? /g, "-");
    str = str.trim();
    return str;
}


module.exports = {
    concatTag,
    translate,
    translate_bill,
    formatLink,
    getDate,
    createSlug
}