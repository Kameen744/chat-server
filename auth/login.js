var AppDB = require('./../db');
var CDB = new AppDB('database.sqlite3');

class Login {
    constructor(socket, io, user) {
        CDB.get('SELECT id, username, created_on FROM `users` WHERE `username` = ? AND `password` = ?',
            [user.username, user.password])
            .then(user => {
                if (user) {
                    CDB.run('UPDATE `users` SET `online` = ?, `socket_id` = ? WHERE `id` = ?',
                        [1, socket.id, user.id]);

                    CDB.all(
                        'SELECT `user_id`, `freind_id`, `username` `online` FROM `user_chats` AS fid LEFT JOIN `users` AS usr ON fid.freind_id = usr.id WHERE fid.user_id = ?',
                        [user.id])
                        .then(chats => {
                            CDB.all(`SELECT * FROM 'chat_rooms'`)
                                .then(rooms => {
                                    io.to(socket.id).emit('login_success', { 'user': user, 'chats': chats, 'rooms': rooms });
                                    // io.to(socket.id).emit('chat_rooms', rooms);
                                });
                        });

                } else {
                    io.to(socket.id).emit('login_fail', 'Wrong Username or Password');
                }
            })
    }
}

module.exports = Login;