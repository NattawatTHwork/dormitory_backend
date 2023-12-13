var express = require('express');
var cors = require('cors');
var app = express();

app.use(cors());

app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/auth', require('./routes/auth'));
app.use('/rooms', require('./routes/rooms'));
app.use('/users', require('./routes/users'));
app.use('/services', require('./routes/services'));
app.use('/bills', require('./routes/bills'));
app.use('/uploads', require('./routes/uploads'));
app.use('/img', express.static('img'));

app.listen(3000, function () {
    console.log('CORS-enabled web server listening on port 3000');
});
