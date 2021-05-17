
import React, { useState, useEffect } from 'react';

const io = require('socket.io-client');
require('dotenv').config();
const HOST = process.env.REACT_APP_HOST || 'http://localhost:3001';
const socket = io.connect(`${HOST}/gifs`);

let Chat = ({ user }) => {

    const [state, setState] = useState({ message: '', user: 'admin' });
    const [chat, setChat] = useState([]);
    const [participants, setParticipants] = useState([]);

    const onChang = (e) => {
        setState({ ...state, message: e.target.value })
    }

    useEffect(() => {
        //Notifies when user joines room
        socket.on('user joined', payload => {
            //Sets chat notification of user joining room
            setChat(arr => [...arr, { type: "notification", message: `User ${payload.user} has joined the room`, user: payload.user }]);
        });

        socket.on('get participants', payload => {
            //Receives list of participants from socket server
            setParticipants(payload.participants)
        })

        //User has sent a message
        socket.on('message', payload => {
            //Updates the chat message list
            setChat(arr => [...arr, { message: payload.message, user: payload.user }])
        });

        //Notifies when user leaves a room
        socket.on('user disconnected', payload => {
            console.log(payload);
            setChat(arr => [...arr, { type: "notification", message: `User ${payload.user} has left the room`, user: payload.user }])
        })

        //TODOS
        //Have user join main room after login

        //Once User logs in, updates state for current user
        setState({ ...state, user })

        // socket.emit('join', { user: state.user, room: "Main Room" })
    }, [])

    //Displays the chat messages
    const chatWindow = () => {
        return chat.map(({ message, user, type }, index) => (
            type === 'notification' ?
                <div key={index}>
                    <h4>
                        {message}
                    </h4>
                </div>
                :
                <div key={index}>
                    <h2>
                        {/* {user}: <img alt={index} src={message} /> */}
                        {user}: {message}
                    </h2>
                </div>
        ))
    }

    //Displays the participants
    const chatParticipants = () => {
        return participants.map((user, index) => (
            <div key={index}>
                <h3>
                    {user}
                </h3>
            </div>
        ))
    }

    //Users should be able to create own public rooms or private rooms to specific users
    const joinRoom = () => {
        socket.emit('join', { user: state.user, room: "Custom room" });
    }

    const leaveRoom = () => {
        socket.emit('leave', { user: state.user, room: "Custom room" });
    }

    const sendMessage = () => {
        socket.emit('message', { message: state.message, user: state.user })
    }

    //Add method to fetch Giphy API on chat input

    return (
        <>
            <input placeholder="Enter a message" onChange={(e) => onChang(e)} value={state.message}></input>
            <button onClick={sendMessage}>Send Message</button>
            <button onClick={joinRoom}>Join Main Room</button>
            <button onClick={leaveRoom}>Leave Room</button>

            <h1>logs</h1>
            {chatWindow()}

            {participants && (
                <>
                    <h2>Chat Participants</h2>
                    {chatParticipants()}
                </>
            )}

        </>
    )
}

export default Chat;