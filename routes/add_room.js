var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var connection = require('../database');
const checkUserAuthorization = require('./checkUserAuthorization');

router.post('/', jsonParser, checkUserAuthorization, (req, res, next) => {
    connection.execute(
        'INSERT INTO rooms (name_room, price, status) VALUES (?, ?, ?)',
        [req.body.name_room, req.body.price, req.body.status],
        (err, results, fields) => {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }
            res.json({ status: 'success' });
        }
    );
});

router.post('/:id', jsonParser, checkUserAuthorization, (req, res, next) => {
    // res.json({message: req.body.hasOwnProperty('price')})
    if (Object.keys(req.body).length == 1) {
        connection.execute(
            'UPDATE rooms SET user_id = ? WHERE room_id = ?',
            [req.body.user_id, req.params.id],
            (err, results, fields) => {
                if (err) {
                    res.json({ status: 'error', message: err });
                    return;
                }
                res.json({ status: 'success' });
            }
        );
    } else {
        connection.execute(
            'UPDATE rooms SET name_room = ?, price = ?, status = ? WHERE room_id = ?',
            [req.body.name_room, req.body.price, req.body.status, req.params.id],
            (err, results, fields) => {
                if (err) {
                    res.json({ status: 'error', message: err });
                    return;
                }
                res.json({ status: 'success' });
            }
        );
    }
});

module.exports = router;
