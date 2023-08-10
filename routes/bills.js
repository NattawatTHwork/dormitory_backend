var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var connection = require('../database');
const checkUserAuthorization = require('./checkUserAuthorization');

router.post('/', jsonParser, checkUserAuthorization, (req, res, next) => {
    const randomNumber = Math.floor(Math.random() * (9999999 - 0 + 1)) + 0;
    connection.execute(
        'INSERT INTO bill (user_id, bill_number, name_room, monthly, price, electricity_fee, electricity_amount, water_fee, water_amount, common_area_fee, maintenance_fee) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [req.body.user_id,
        randomNumber, 
        req.body.name_room,
        req.body.monthly,
        req.body.price,
        req.body.electricity_fee,
        req.body.electricity_amount,
        req.body.water_fee,
        req.body.water_amount,
        req.body.common_area_fee,
        req.body.maintenance_fee],
        (err, results, fields) => {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }
            res.json({ status: 'success' });
        }
    );
});

router.get('/detail/:id', jsonParser, checkUserAuthorization, (req, res, next) => {
    connection.execute(
        'SELECT *, bill.status as bill_status, users.status as user_status FROM bill INNER JOIN users ON bill.user_id = users.user_id WHERE bill_id = ?',
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

router.get('/paid', jsonParser, checkUserAuthorization, (req, res, next) => {
    connection.execute(
        'SELECT *, bill.status as bill_status, users.status as user_status FROM bill INNER JOIN users ON bill.user_id = users.user_id WHERE bill.status = ?',
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

router.get('/unpaid', jsonParser, checkUserAuthorization, (req, res, next) => {
    connection.execute(
        'SELECT *, bill.status as bill_status, users.status as user_status FROM bill INNER JOIN users ON bill.user_id = users.user_id WHERE bill.status = ?' ,
        [0],
        (err, results, fields) => {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }
            res.json({ status: 'success', message: results });
        }
    );
});

router.get('/unpaid/:id', jsonParser,  (req, res, next) => {
    connection.execute(
        'SELECT *, bill.status as bill_status, users.status as user_status FROM bill INNER JOIN users ON bill.user_id = users.user_id WHERE bill.status = ? AND bill.user_id = ?' ,
        [0,req.params.id],
        (err, results, fields) => {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }
            res.json({ status: 'success', message: results });
        }
    );
});

router.put('/change_status/:id', jsonParser, checkUserAuthorization, (req, res, next) => {
    connection.execute(
        'UPDATE bill SET status = ? WHERE bill_id = ?',
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

router.delete('/delete/:id', jsonParser,  (req, res, next) => {
    connection.execute(
      'DELETE FROM bill WHERE bill_id = ?',
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
