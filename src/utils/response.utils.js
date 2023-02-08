const {
    SUCCESS,
    ERROR
} = require('../configs/constant.config.js');

const {
    INTERNAL_SERVER_ERROR,
    UNAUTHORIZED_ERROR,
    FORBIDDEN_ERROR
} = require('../configs/message.config.js');

const badRequestRes = (res, message) => {
    res.status(400).json({
        status: ERROR,
        message
    })
}

const unauthorizedRequestRes = (res) => {
    res.status(401).json({
        status: ERROR,
        message: UNAUTHORIZED_ERROR
    })
}

const forbiddenRequestRes = (res) => {
    res.status(403).json({
        status: ERROR,
        message: FORBIDDEN_ERROR,
    })
}

const internalServerRes = (res) => {
    res.status(500).json({
        status: ERROR,
        message: INTERNAL_SERVER_ERROR,
    })
}

const successRes = (res, message, data) => {
    res.status(200).json({
        status: SUCCESS,
        ...((message != null) && { message }),
        ...((data != null) && { data }),
    });
}

module.exports = Object.freeze({
    badRequestRes,
    unauthorizedRequestRes,
    forbiddenRequestRes,
    internalServerRes,
    successRes,
})