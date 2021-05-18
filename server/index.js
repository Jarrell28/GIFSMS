'use strict';

const PORT = process.env.PORT || 3001;

const io = require('socket.io')(PORT, {
    cors: {
        origin: "*",
    }
});

const gifs = io.of('/gifs');

//Holds participants in each room
const gifsRooms = {};

gifs.on('connection', socket => {
    // console.log('User Joined Chat:' + socket.id);

    //Function to have users join rooms
    socket.on('join', payload => {
        //Initiates list of participants in specific rooms
        //If the room exists, push the joining user in the room array
        if (payload.room in gifsRooms) {
            gifsRooms[payload.room].push(payload.user);
        } else {
            //The room does not exist, create a new room array and add the user
            gifsRooms[payload.room] = [payload.user];
        }

        console.log('Room: ', payload.room)
        console.log('User Joined: ', payload.user);

        //Emits user joined room to clients
        socket.to(payload.room).emit('user joined', payload);

        //Joins the user to the room
        socket.join(payload.room);

        //Sends participants to all clients in specific room
        let participants = gifsRooms[payload.room];
        gifs.in(payload.room).emit('get participants', { participants })

        //Get List of rooms and send to all clients
        let rooms = Object.keys(gifsRooms);
        gifs.in(payload.room).emit('get rooms', { rooms });
    });


    //Function to have DMs

    //listen to new messages from clients
    socket.on('message', payload => {
        //push the message to all other clients
        gifs.emit('message', payload)
    })

    //Handles users leaving rooms
    socket.on('leave', payload => {

        //Removes leaving user from room array
        gifsRooms[payload.room] = gifsRooms[payload.room].filter(user => user !== payload.user);

        //Sends participants to all clients in specific room
        let participants = gifsRooms[payload.room];
        gifs.in(payload.room).emit('get participants', { participants })

        //Emits user left room notification to clients in specific room
        socket.to(payload.room).emit('user disconnected', payload);


        //When a user leaves a room, see if room is empty and delete room
        if (gifsRooms[payload.room].length === 0) {
            delete gifsRooms[payload.room];
        }

        //Handles removal of user from froom
        socket.leave(payload.room);
    })

    // socket.on('disconnect', reason => {
    //     console.log(reason);
    // })

})


//TODOS

//Have Indication of which room you are in

//Be able to click a room and join

//Be able to click a users name and create a Private room


