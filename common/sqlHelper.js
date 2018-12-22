const dateBase = require('./dataBase')

class SqlHelper {

    /**
     * 
     * @param {string} sql 
     * @param {object} args 
     * @returns Promise
     */
    static exec(sql, args) {
        return new Promise((resolve, reject) => {
            const connection = dateBase.createConnection()
            connection.connect(err => {
                if (err) {
                    try {
                        connection.destroy()  
                    } catch (error) {
                         
                    } finally {
                        reject(err)
                    }
                } else {
                    connection.query(sql, args, (err, results, fields) => {
                        
                        try {
                            connection.destroy()
                        } catch (error) {
                            
                        }
                        
                        if (err) {
                            reject(err)
                        }  else {
                            resolve({results, fields})
                        }
                        
                    })    
                }
            })
        })
    }
}

module.exports = SqlHelper