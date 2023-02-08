const { Sequelize, } = require('sequelize');

const db = new Sequelize({
    dialect: 'sqlite',
    storage: './src/db/db.sqlite',
    logging: false,
});

(async () => {
    await db.sync();
    // `text` is not available here
})();


module.exports = db;