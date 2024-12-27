const mysql =require('mysql2/promise');

exports.mysqlConnect=async(q)=> {
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            database:process.env.MYSQL_DATABASE,
            port: 3306,
            password: process.env.MYSQL_PASSWORD,
        });
        return connection.query(q)

    } catch (err) {
        console.log(err);
    }
}
