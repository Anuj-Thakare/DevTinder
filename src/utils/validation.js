const validator = require("validator");

const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Enter a valid name");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong");
    }
};

const validateProfileData = (req) => {
    const allowEdit = ["firstName", "lastName", "emailId", "photoUrl", "gender", "age", "about", "skills"];
    const isEditAllowed = Object.keys(req.body).every(field => allowEdit.includes(field));

    return isEditAllowed;
};

const validateForgotPassword = (req) => {
    const {newPassword, confirmNewPassword} = req.body;
    if(!validator.isStrongPassword(newPassword)){
        throw new Error("Entered password is not strong");
    }
}

module.exports = {validateSignUpData, validateProfileData, validateForgotPassword};