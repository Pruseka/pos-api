module.exports = Object.freeze({
    ERROR: 'error',
    SUCCESS: 'success',

    ValidationError: 'ValidationError',
    SequelizeUniqueConstraintError: 'SequelizeUniqueConstraintError',
    BadRequestError: 'BadRequestError',
    UnauthorizedRequestError: 'UnauthorizedRequestError',
    ForbiddenRequestError: 'ForbiddenRequestError',


    JWT_SECRET: 'admin@ideafresh@posapi@2022',
    APP_SECRET: 'app_secret',
    SALT_ROUND: 10,
    
    ADMIN: 'admin',
    SALESMAN: 'salesman',

    RETAIL: 'retail',
    WHOLESALES: 'wholesales',

    CASH: 'cash',
    CREDIT: 'credit',
    RETURN: 'return',
    CANCEL: 'cancel',
    DAMAGE: 'damage',

    UNPAID: 'unpaid',
    PAID: 'paid',

    TO: 'to',
    FROM: 'from',

    IN: 'in',
    OUT: 'out',
})