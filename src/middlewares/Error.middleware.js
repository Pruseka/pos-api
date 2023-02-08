const {
    badRequestRes,
    forbiddenRequestRes,
    unauthorizedRequestRes,
} = require('../utils/response.utils.js');

const {
    ValidationError,
    SequelizeUniqueConstraintError,
    BadRequestError,
    UnauthorizedRequestError,
    ForbiddenRequestError,
} = require('../configs/constant.config.js');

const {
    UNAUTHORIZED_ERROR,
    FORBIDDEN_ERROR,
} = require('../configs/message.config');

const log = (err) => {
    console.log("error object :", err);
}

const errorHandler = (err, req, res, next) => {
    if(err.name === ValidationError) {
        badRequestRes(res, err.message);
        return
    }
    if(err.name === SequelizeUniqueConstraintError) {
        badRequestRes(res, err.errors[0].message);
        return;
    }
    if(err.name === BadRequestError) {
        badRequestRes(res, err.message);
        return;
    }
    if(err.name === ForbiddenRequestError) {
        forbiddenRequestRes(res, FORBIDDEN_ERROR);
        return;
    }
    if(err.name === UnauthorizedRequestError) {
        unauthorizedRequestRes(res, UNAUTHORIZED_ERROR);
    }
    log(err);
    next()
};

module.exports = errorHandler;