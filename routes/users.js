var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var connection = require('../database');
const checkUserAuthorization = require('./checkUserAuthorization');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/admins', jsonParser, checkUserAuthorization, (req, res, next) => {
    connection.execute(
        'SELECT user_id, username, first_name, last_name, status, role FROM users WHERE role = ?',
        [1],
        (err, results, fields) => {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }
            res.json({ status: 'success', message: results });
        }
    );
});

router.get('/admin/:id', jsonParser, checkUserAuthorization, (req, res, next) => {
    connection.execute(
        'SELECT * FROM users WHERE role = ? AND user_id = ?',
        [1, req.params.id],
        (err, results, fields) => {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }
            res.json({ status: 'success', message: results[0] });
        }
    );
});

router.get('/users', jsonParser, checkUserAuthorization, (req, res, next) => {
    connection.execute(
        'SELECT user_id, username, first_name, last_name, status, role FROM users WHERE role = ?',
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

router.get('/user/:id', jsonParser, (req, res, next) => {
    connection.execute(
        'SELECT * FROM users INNER JOIN tenant_detail ON users.user_id = tenant_detail.user_id WHERE role = ? AND users.user_id = ?',
        [3, req.params.id],
        (err, results, fields) => {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }
            res.json({ status: 'success', message: results[0] });
        }
    );
});

router.post('/create_admin', jsonParser, checkUserAuthorization, (req, res, next) => {
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
                        res.json({ status: 'success' });
                    }
                );
            });
        }
    );
});

router.post('/create_user', jsonParser, checkUserAuthorization, (req, res, next) => {
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

router.put('/change_status/:id', jsonParser, checkUserAuthorization, (req, res, next) => {
    connection.execute(
        'UPDATE users SET status = ? WHERE user_id = ?',
        [req.body.status, req.params.id],
        (err, results, fields) => {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }
            res.json({ status: 'success' });
        }
    );
});

router.put('/edit_admin/:id', jsonParser, checkUserAuthorization, (req, res, next) => {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        connection.execute(
            'UPDATE users SET username = ?, password = ?, password_view = ?, first_name = ?, last_name = ? WHERE user_id = ?',
            [req.body.username, hash, req.body.password, req.body.first_name, req.body.last_name, req.params.id],
            function (err, results, fields) {
                if (err) {
                    res.json({ status: 'error', message: err });
                    return;
                }
                res.json({ status: 'success' });
            }
        );
    });
});

router.put('/edit_user/:id', jsonParser, checkUserAuthorization, (req, res, next) => {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        connection.execute(
            'UPDATE users SET username = ?, password = ?, password_view = ?, first_name = ?, last_name = ? WHERE user_id = ?',
            [req.body.username, hash, req.body.password, req.body.first_name, req.body.last_name, req.params.id],
            function (err, results, fields) {
                if (err) {
                    res.json({ status: 'error', message: err });
                    return;
                }
                connection.execute(
                    'UPDATE tenant_detail SET email = ?, phone = ? WHERE user_id = ?',
                    [req.body.email, req.body.phone, req.params.id],
                    function (err, results, fields) {
                        if (err) {
                            res.json({ status: 'error', message: err });
                            return;
                        }
                        res.json({ status: 'success' });
                    }
                );
            }
        );
    });
});

router.delete('/:id', jsonParser, checkUserAuthorization, (req, res, next) => {
    connection.execute(
        'SELECT * FROM users WHERE user_id = ?',
        [req.params.id],
        (err, results, fields) => {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }
            if (results[0].role == 1) {
                connection.execute(
                    'DELETE FROM users WHERE user_id = ?',
                    [req.params.id],
                    (err, results, fields) => {
                        if (err) {
                            res.json({ status: 'error', message: err });
                            return;
                        }
                        res.json({ status: 'success' });
                    }
                );
            } else if (results[0].role == 2) {

            } else if (results[0].role == 3) {
                connection.execute(
                    'DELETE FROM users WHERE user_id = ?',
                    [req.params.id],
                    (err, results, fields) => {
                        if (err) {
                            res.json({ status: 'error', message: err });
                            return;
                        }
                        connection.execute(
                            'DELETE FROM tenant_detail WHERE user_id = ?',
                            [req.params.id],
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
        }
    );
});

module.exports = router;
