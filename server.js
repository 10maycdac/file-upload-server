const express    = require('express');
const fileUpload = require('express-fileupload');
const parser     = new (require('simple-excel-to-json').XlsParser)();
const mysql      = require('mysql');
const app        = express();

app.use(fileUpload());

let receivedFileName = '';

//Download EndPoint
app.get('/download', (req, res) =>
	res.download('./template.xls', 'template-file.xls', err => {
		if (err) {
            //handle error
            console.log(err);
			return;
		} else {
			//do something
            console.log('File sent')
		}
	})
);

// Upload Endpoint
app.post('/upload', (req, res) => {
	if (req.files === null) {
		return res.status(400).json({ msg: 'No file uploaded' });
	}

	const file = req.files.file;
	receivedFileName = './uploads/' + file.name;
	console.log(receivedFileName);
	file.mv(`${__dirname}/uploads/${file.name}`, err => {
		if (err) {
			console.error(err);
			return res.status(500).send(err);
		}

		res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });

		//kadu's code
		let doc = parser.parseXls2Json(receivedFileName);
		let productsArray = doc[0];

		console.log(productsArray);

		var conn = mysql.createConnection({
			host    : 'localhost',
			user    : 'root',
			password: 'root',
			database: 'products'
		});

		conn.connect(function(err) {
			if (err) {
				console.error('error connecting: ' + err.stack);
				return;
			}

			console.log('connected as id ' + conn.threadId);
		});

		let values = [];

		productsArray.forEach(product => {
			let productArray = Object.values(product);
			values.push(productArray);
		});

		var sql =
			'INSERT INTO product_details (Model_Number, Amazon_ID, Walmart_ID, Wayfair, Product_Name, Brand, Collection, Category, Sub_Category, Margin) VALUES ?';

		conn.query(sql, [values], function(err) {
			if (err) throw err;
			conn.end();
		});
	});
});

app.listen(5000, () => console.log('Server Started...'));
