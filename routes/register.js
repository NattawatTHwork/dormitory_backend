var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const bcrypt = require('bcrypt');
const saltRounds = 10;
var connection = require('../database');

router.post('/', jsonParser, (req, res, next) => {
    connection.execute(
        'SELECT * FROM users WHERE username = ?',
        [req.body.username],
        (err, results, fields) => {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }

            if (results.length > 0) {
                res.json({ status: 'exists', message: 'Username already exists' });
                return;
            }

            bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                connection.execute(
                    'INSERT INTO users (username, password, password_view, first_name, last_name, role) VALUES (?, ?, ?, ?, ?, ?)',
                    [req.body.username, hash, req.body.password, req.body.first_name, req.body.last_name, 1],
                    function (err, results, fields) {
                        if (err) {
                            res.json({ status: 'error', message: err });
                            return;
                        }
                        res.json({ status: 'success', message: 'Register Success' });
                    }
                );
            });
        }
    );
});


module.exports = router;
