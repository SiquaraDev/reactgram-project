const { body } = require("express-validator");

const userCreateValidation = () => {
    return [
        body("name")
            .isString()
            .withMessage("Name is required.")
            .isLength({ min: 3 })
            .withMessage("Minimum 3 characters in name."),
        body("email")
            .isString()
            .withMessage("Email is required.")
            .isEmail()
            .withMessage("Insert a valid email."),
        body("password")
            .isString()
            .withMessage("Password is required.")
            .isLength({ min: 5 })
            .withMessage("Minimum 5 characters in password."),
        body("confirmPassword")
            .isString()
            .withMessage("Confirm password is required.")
            .custom((value, { req }) => {
                if (value != req.body.password) {
                    throw new Error("The passwords are not the same.");
                }
                return true;
            }),
    ];
};

const userLoginValidation = () => {
    return [
        body("email")
            .isString()
            .withMessage("Email is required.")
            .isEmail()
            .withMessage("Insert a valid email."),
        body("password").isString().withMessage("Password is required."),
    ];
};

const userUpdateValidation = () => {
    return [
        body("name")
            .optional()
            .isLength({ min: 3 })
            .withMessage("Minimum 3 characters in name."),
        body("password")
            .optional()
            .isLength({ min: 5 })
            .withMessage("Minimum 5 characters in password."),
    ];
};

module.exports = {
    userCreateValidation,
    userLoginValidation,
    userUpdateValidation,
};
