var express = require('express');
var app = express();
var http = require('http').createServer(app);
var AppDB = require('./db');
var Login = require('./auth/login');
const Logout = require('./auth/logout');
var io = require('socket.io')(http);
var CDB = new AppDB('database.sqlite3');

var port = process.env.PORT;

// app.get('/', (req, res) => {
//     res.send('Hello From Express');
// });
app.use('/assets', express.static(__dirname + '/public/assets'));

io.on('connection', (socket) => {

    socket.on('user_login', (user) => {
        new Login(socket, io, user);
    });

    socket.on('joinRoom', (room, user) => {
        socket.join(room.room_id);
        io.to(room.room_id).emit('memberJoined', user);
    });

    socket.on('sendMessage', (message) => {
        io.to(message.room.room_id).emit('recieveMessage', message);
    });

    socket.on('disconnect', () => {
        new Logout(socket);
    });
});

http.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})

// var url = 'http://chat.vms.ng';
// http.listen(port, url, () => {
//     console.log(`Server listening on ${url} port ${port}`);
// });