const mysql =require('mysql2/promise');

exports.mysqlConnect=async(q)=> {
    try {
        const connection = await mysql.createConnection({
            host: 'adorwelding.org',
            user: 'maintainance_select',
            database: 'Maintenance',
            port: 3306,
            password: 'cxjvbycnwfnb',
        });
        return connection.query(q)

    } catch (err) {
        console.log(err);
    }
}
