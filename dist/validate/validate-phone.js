"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePhoneNumber = void 0;
const validatePhoneNumber = (phone) => {
    var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    return re.test(phone);
};
exports.validatePhoneNumber = validatePhoneNumber;
