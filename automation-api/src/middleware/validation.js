const Joi = require("joi");

const registerSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),

    email: Joi.string().trim().lowercase().email().required(),

    password: Joi.string().min(6).max(100).required(),

    organizationName: Joi.string().trim().min(2).max(100).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required(),

    password: Joi.string().required(),
});

const validateRegister = (req, res, next) => {
    const { error } = registerSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.details.map((detail) => detail.message),
        });
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.details.map((detail) => detail.message),
        });
    }

    next();
};

module.exports = {
    validateRegister,
    validateLogin
};