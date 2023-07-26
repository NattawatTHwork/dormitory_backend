const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.SECRET_KEY;

checkUserAuthorization = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        res.json({ status: 'error', message: 'Unauthorized' });
        return;
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            res.json({ status: 'error', message: err.message });
            return;
        }
        req.decoded = decoded;
        next();
    });
}

module.exports = checkUserAuthorization;
