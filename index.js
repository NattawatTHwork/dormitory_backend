var express = require('express');
var cors = require('cors');
var app = express();

app.use(cors());

app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/auth', require('./routes/auth'));
// app.use('/add_room', require('./routes/add_room'));
// app.use('/get_room', require('./routes/get_room'));
// app.use('/add_user', require('./routes/add_user'));
// app.use('/get_user', require('./routes/get_user'));
app.use('/rooms', require('./routes/rooms'));
app.use('/users', require('./routes/users'));
app.use('/services', require('./routes/services'));
// app.use('/get_invoice', require('./routes/get_invoice'));
app.use('/bills', require('./routes/bills'));

app.listen(3000, function () {
    console.log('CORS-enabled web server listening on port 3000');
});
