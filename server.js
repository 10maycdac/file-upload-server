const express = require('express');
const fileUpload = require('express-fileupload');
const parser = new (require('simple-excel-to-json').XlsParser)();

const app = express();

app.use(fileUpload());

let receivedFileName = "";
// Upload Endpoint
app.post('/upload', (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }

    const file = req.files.file;
    receivedFileName = "./uploads/" + file.name;
    console.log(receivedFileName);
    file.mv(`${__dirname}/uploads/${file.name}`, err => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }

        res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });


        //kadu's code

        let doc = parser.parseXls2Json(receivedFileName);
        let productArray = doc[0];
        console.log(productArray);
    });
});

app.listen(5000, () => console.log('Server Started...'));
