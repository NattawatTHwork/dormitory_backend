var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const bcrypt = require('bcrypt');
var connection = require('../database');
var jwt = require('jsonwebtoken');
require('dotenv').config()
const secret = process.env.SECRET_KEY;

router.post('/', jsonParser, (req, res, next) => {
    connection.execute(
        'SELECT * FROM users WHERE username = ?',
        [req.body.username],
        (err, users, fields) => {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }

            if (users.length == 0) {
                res.json({ status: 'nofound', message: 'No user found.' });
                return;
            }

            if (users[0].status == 0) {
                res.json({ status: 'disable', message: 'Disable' });
                return;
            }

            bcrypt.compare(req.body.password, users[0].password, function (err, isLogin) {
                if (isLogin) {
                    var token = jwt.sign({ user_id: users[0].user_id, role: users[0].role }, secret, { expiresIn: '1h' });
                    res.json({ status: 'success', message: users[0].role, token });
                } else {
                    res.json({ status: 'failed', message: 'Login Failed' });
                }
            });
        }
    );
});

module.exports = router;
