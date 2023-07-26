var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var connection = require('../database');
const checkUserAuthorization = require('./checkUserAuthorization');

// router.get('/', jsonParser, checkUserAuthorization, (req, res, next) => {
//     connection.execute(
//         'SELECT * FROM rooms',
//         (err, results, fields) => {
//             if (err) {
//                 res.json({ status: 'error', message: err });
//                 return;
//             }
//             res.json({ status: 'success', message: results });
//         }
//     );
// });

// router.get('/:id', jsonParser,  (req, res, next) => {
//     connection.execute(
//         'SELECT * FROM rooms INNER JOIN users ON rooms.user_id = users.user_id WHERE room_id = ?',
//         [req.params.id],
//         (err, results, fields) => {
//             if (err) {
//                 res.json({ status: 'error', message: err });
//                 return;
//             }
//             res.json({ status: 'success', message: results });
//         }
//     );
// });


module.exports = router;
