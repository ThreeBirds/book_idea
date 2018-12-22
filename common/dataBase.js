let mysql = require('mysql');
const config = require('../config');

class DataBase {
    /**
     * @returns connection
     */
    static createConnection() {
        try {
            let connection = mysql.createConnection({
                host: config.mysql.host,
                user: config.mysql.user,
                password: config.mysql.pass,
                port: config.mysql.port,
                database: config.mysql.db
            });
            return connection;
        } catch (e) {
            return null;
        }
    }
}

module.exports = DataBase;