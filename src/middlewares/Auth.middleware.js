const jwt = require("jsonwebtoken");

const {
    JWT_SECRET,
    UnauthorizedRequestError,
    ForbiddenRequestError,
} = require("../configs/constant.config.js");

const {
    createError
} = require("../utils/error.utils.js");

const authHandler = (roles) => {
    return function (req, res, next) {
        try {
            const header = req.headers['authorization'];
            if (!header) {
                next(createError(UnauthorizedRequestError, ''));
            }
            const token = header.slice(7);
            const user = jwt.verify(token, JWT_SECRET);

            if (!roles.includes(user.role)) {
                next(createError(ForbiddenRequestError, ''))
            }
            req.user = user;
            next();
        } catch (err) {
            next(createError(UnauthorizedRequestError, ''));
        }
    }
}

module.exports = authHandler;