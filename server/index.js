'use strict';

const PORT = process.env.PORT || 3001;

const io = require('socket.io')(PORT, {
    cors: {
        origin: "*",
    }
});

const gifs = io.of('/gifs');

gifs.on('connection', socket => {
    // console.log('User Joined Chat:' + socket.id);

    //Function to have users create rooms
    socket.on('join', payload => {
        console.log('Room: ', payload.room)
        console.log('User Joined: ', payload.name);

        socket.to(payload.room).emit('user joined', payload); //This emits the message to clients
        socket.join(payload.room); // This creates the room
    })

    //Function to have DMs

    //listen to new messages from clients
    socket.on('message', payload => {
        console.log(payload);
        //push the message to all other clients
        gifs.emit('message', payload)
    })

})



