var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var connection = require('../database');
const checkUserAuthorization = require('./checkUserAuthorization');

router.get('/room', jsonParser, checkUserAuthorization, (req, res, next) => {
    connection.execute(
        'SELECT room_id, user_id, name_room, price, status FROM rooms',
        (err, results, fields) => {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }
            res.json({ status: 'success', message: results });
        }
    );
});

router.get('/room/:id', jsonParser, checkUserAuthorization, (req, res, next) => {
    connection.execute(
        'SELECT room_id, name_room, price, status FROM rooms WHERE room_id = ?',
        [req.params.id],
        (err, results, fields) => {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }
            res.json({ status: 'success', message: results[0] });
        }
    );
});

router.get('/room_user', jsonParser, checkUserAuthorization, (req, res, next) => {
    connection.execute(
        'SELECT room_id, rooms.user_id, name_room, price, username, first_name, last_name, role, rooms.status as room_status, users.status as user_status FROM rooms LEFT JOIN users ON rooms.user_id = users.user_id',
        (err, results, fields) => {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }
            res.json({ status: 'success', message: results });
        }
    );
});

router.get('/room_user/:id', jsonParser, checkUserAuthorization, (req, res, next) => {
    connection.execute(
        'SELECT room_id, rooms.user_id, name_room, price, username, first_name, last_name, role, rooms.status as room_status, users.status as user_status FROM rooms LEFT JOIN users ON rooms.user_id = users.user_id WHERE room_id = ?',
        [req.params.id],
        (err, results, fields) => {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }
            res.json({ status: 'success', message: results[0] });
        }
    );
});

router.post('/create_room', jsonParser, checkUserAuthorization, (req, res, next) => {
    connection.execute(
        'INSERT INTO rooms (name_room, price) VALUES (?, ?)',
        [req.body.name_room, req.body.price],
        (err, results, fields) => {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }
            res.json({ status: 'success' });
        }
    );
});

router.put('/change_status/:id', jsonParser, checkUserAuthorization, (req, res, next) => {
    connection.execute(
        'UPDATE rooms SET status = ? WHERE room_id = ?',
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

router.put('/manage_user/:id', jsonParser, checkUserAuthorization, (req, res, next) => {
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
});

router.put('/edit_room/:id', jsonParser, checkUserAuthorization, (req, res, next) => {
    connection.execute(
        'UPDATE rooms SET name_room = ?, price = ? WHERE room_id = ?',
        [req.body.name_room, req.body.price, req.params.id],
        (err, results, fields) => {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }
            res.json({ status: 'success' });
        }
    );
});

router.delete('/:id', jsonParser, checkUserAuthorization, (req, res, next) => {
    connection.execute(
      'DELETE FROM rooms WHERE room_id = ?',
      [req.params.id],
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
