var AppDB = require('./../db');
var CDB = new AppDB('database.sqlite3');

class Logout {
    constructor(socket) {
        CDB.run('UPDATE `users` SET `online` = ? WHERE `socket_id` = ?',
            [0, socket.id]);
        console.log(`${socket.id} disconnected `);
    }
}

module.exports = Logout;
