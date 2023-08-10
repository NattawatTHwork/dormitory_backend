var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var connection = require('../database');
const checkUserAuthorization = require('./checkUserAuthorization');

router.get('/', jsonParser, checkUserAuthorization, (req, res, next) => {
    connection.execute(
        'SELECT * FROM services',
        (err, results, fields) => {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }
            res.json({ status: 'success', message: results[0] });
        }
    );
});

router.put('/', jsonParser, checkUserAuthorization, (req, res, next) => {
    connection.execute(
        'UPDATE services SET electricity_fee = ?, water_fee = ?, common_area_fee = ? WHERE service_id = ?',
        [req.body.electricity_fee, req.body.water_fee, req.body.common_area_fee, req.body.service_id],
        (err, results, fields) => {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }
            res.json({ status: 'success' });
        }
    );
});

module.exports = router;
