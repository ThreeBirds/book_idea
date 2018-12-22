const dateBase = require('./dataBase')

class SqlHelper {

    static exec(sql, args, call) {
        const connection = dateBase.createConnection()
        connection.connect(err => {
            if (err) {
                call(err)
                try {
                    connection.destroy()
                } catch (error) {
                    
                }
            } else {
                connection.query(sql, args, (err, results, fields) => {
                    call(err, results, fields)
                    try {
                        connection.destroy()
                    } catch (error) {
                        
                    }
                })
            }
        })
    }
}

module.exports = SqlHelper