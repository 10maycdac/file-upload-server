var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'products'
});

connection.connect(function(err) {
	if (err) {
		return console.error('error: ' + err.message);
	}

	console.log('Connected to the MySQL server.');
});
connection.query('desc product_details', (err, rows) => {
	if (err) throw err;

	console.log('Data received from Db:');
	console.log(rows);
});
// connection.query('SELECT 1 + 1 AS solution', function(error, results, fields) {
// 	if (error) throw error;
// 	console.log('The solution is: ', results[0].solution);
// });

connection.end();
