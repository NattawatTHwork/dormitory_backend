var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var connection = require('../database');
const checkUserAuthorization = require('./checkUserAuthorization');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/', jsonParser, checkUserAuthorization, (req, res, next) => {
    connection.execute(
        'SELECT * FROM users WHERE role = ?',
        [3],
        (err, results, fields) => {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }
            res.json({ status: 'success', message: results });
        }
    );
});

router.get('/enable', jsonParser, checkUserAuthorization, (req, res, next) => {
    connection.execute(
        'SELECT * FROM users WHERE role = ? AND status = ?',
        [3, 1],
        (err, results, fields) => {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }
            res.json({ status: 'success', message: results });
        }
    );
});

router.post('/', jsonParser, checkUserAuthorization, (req, res, next) => {
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
                    [req.body.username, hash, req.body.password, req.body.first_name, req.body.last_name, 3],
                    function (err, results, fields) {
                        if (err) {
                            res.json({ status: 'error', message: err });
                            return;
                        }
                        // res.json({ status: 'success', message: 'Register Success' });
                        connection.execute(
                            'SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1',
                            (err, results, fields) => {
                                if (err) {
                                    res.json({ status: 'error', message: err });
                                    return;
                                }
                                connection.execute(
                                    'INSERT INTO tenant_detail (user_id, email, phone) VALUES (?, ?, ?)',
                                    [results[0].user_id, req.body.email, req.body.phone],
                                    (err, results, fields) => {
                                        if (err) {
                                            res.json({ status: 'error', message: err });
                                            return;
                                        }
                                        res.json({ status: 'success' });
                                    }
                                );
                            }
                        );
                    }
                );
            });        
        }
    );
});

module.exports = router;
