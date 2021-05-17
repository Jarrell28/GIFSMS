import React, { useState, useEffect } from 'react';

const io = require('socket.io-client');
require('dotenv').config();
const HOST =  'http://localhost:3001';
// process.env.REACT_APP_HOST
const socket = io.connect(`${HOST}/gifs`);

let Chat = (props) => {

    const [state, setState] = useState({ message: '', user: props.user ||'admin' });
    const [chat, setChat] = useState([]);

    const onChang = (e) => {
        setState({ ...state, message: e.target.value })
    }

    useEffect(() => {
        socket.on('user joined', payload => {
            console.log('JOINED')
            setChat(arr => [...arr, { message: payload.user, user: props.user }])
        })

        socket.on('message', payload => {
            console.log('messaged', payload)
            setChat(arr => [...arr, { message: payload.message, user: payload.user }])
            setState({ message: "", user: props.user });
        });
 
    }, [])

    const chatWindow = () => {
        return chat.map(({ message, user }, index) => (
            <div key={index}>
                <h2>
                    {/* {user}: <img alt={index} src={message} /> */}
                    {user}: <p>{message}</p>
                </h2>
            </div>
        ))
    }

    //Users should be able to create own public rooms or private rooms to specific users
    const joinRoom = () => {
        socket.emit('join', { name: state.user, room: "Custom room" });
        console.log(props.user);
    }

    const sendMessage = () => {
        socket.emit('message', { message: state.message, user: state.user })
    }

    return (
        <>
            <input placeholder="Enter a message" onChange={(e) => onChang(e)} value={state.message}></input>
            <button onClick={sendMessage}>Send Message</button>
            <button onClick={joinRoom}>Join Main Room</button>

            <h1>logs</h1>
            {chatWindow()}
        </>
    )
}

// module.exports = Chat;
export default Chat;