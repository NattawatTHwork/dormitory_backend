var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var connection = require('../database');
const checkUserAuthorization = require('./checkUserAuthorization');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './img/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
}).single('image');

router.post('/', jsonParser, (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            res.json({ status: 'error', message: err });
        } else {
            if (req.file) {
                connection.execute(
                    'UPDATE bill SET img_path = ? WHERE bill_id = ?',
                    [req.file.filename, req.body.bill_id],
                    (err, results, fields) => {
                        if (err) {
                            res.json({ status: 'error', message: err });
                            return;
                        }
                        res.json({ status: 'success', message: req.file.filename });
                    }
                );
            } else {
                res.json({ status: 'nofile', message: 'No file selected.' })
            }
        }
    });
});

router.get('/:filename', (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, '../img/', filename);

    res.sendFile(imagePath);
});

module.exports = router;