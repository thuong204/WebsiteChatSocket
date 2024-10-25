export const validatePhoneNumber = (phone:string) => {
    var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    
    return re.test(phone);
}