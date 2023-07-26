var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var connection = require('../database');
const checkUserAuthorization = require('./checkUserAuthorization');

router.get('/', jsonParser, checkUserAuthorization, (req, res, next) => {
    connection.execute(
        'SELECT * FROM rooms',
        (err, results, fields) => {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }
            res.json({ status: 'success', message: results });
        }
    );
});

router.get('/:id', jsonParser, checkUserAuthorization, (req, res, next) => {
    // res.json({message: req.params.id})
    connection.execute(
        'SELECT * FROM rooms WHERE room_id = ?',
        [req.params.id],
        (err, results, fields) => {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }
            if (results.length == 0) {
                res.json({ status: 'nodata', message: 'No data' });
            }
            if (results[0].user_id == 0) {
                res.json({ status: 'success', message: results[0] });
            } else {
                connection.execute(
                    'SELECT * FROM rooms INNER JOIN users ON rooms.user_id = users.user_id WHERE room_id = ?',
                    [req.params.id],
                    (err, results, fields) => {
                        if (err) {
                            res.json({ status: 'error', message: err });
                            return;
                        }
                        res.json({ status: 'success', message: results[0] });
                    }
                );
            }
        }
    );
});


module.exports = router;
