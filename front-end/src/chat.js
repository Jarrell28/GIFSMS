import React, { useState, useEffect } from 'react';
import './chat.css';


const superagent = require('superagent');
const io = require('socket.io-client');
require('dotenv').config();
const HOST = process.env.REACT_APP_HOST || 'http://localhost:3001';
const socket = io.connect(`${HOST}/gifs`);

let Chat = ({ user }) => {

    const [state, setState] = useState({ message: '', user: '' });
    const [chat, setChat] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [newRoom, setNewRoom] = useState('');
    const [gifArray, setGifArray] = useState([]);

    const onChang = (e) => {
        setState({ ...state, message: e.target.value })
    }

    useEffect(() => {
        //Notifies when user joines room
        socket.on('user joined', payload => {
            //Sets chat notification of user joining room
            setChat(arr => [...arr, { type: "notification", message: `User ${payload.user} has joined the room`, user: payload.user }]);
        });

        //Receives list of participants from socket server
        socket.on('get participants', payload => {
            setParticipants(payload.participants)
        })

        //Receives list of rooms
        socket.on('get rooms', payload => {
            setRooms(payload.rooms);
        })

        //User has sent a message
        socket.on('message', payload => {
            //Updates the chat message list
            setChat(arr => [...arr, { message: payload.message, user: payload.user }])
        });

        //Once User logs in, updates state for current user
        setState({ ...state, user });


        //Notifies when user leaves a room
        socket.on('user disconnected', payload => {
            console.log(payload);
            setChat(arr => [...arr, { type: "notification", message: `User ${payload.user} has left the room`, user: payload.user }])
        })


    }, [])

    //Have user join main room after login
    useEffect(() => {
        if (state.user) {
            socket.emit('join', { user: state.user, room: "Main Room" })
        }
    }, [state.user])

    const Data = { set: [] };
    // `https://api.giphy.com/v1/gifs/search?api_key=${process.env.REACT_APP_GIF_API}&q=${state.message}&limit=5`;
    Data.handleAPICall = async (req, res) => {
        const url = `https://api.giphy.com/v1/gifs/search?q=${state.message}&limit=5`;
        console.log("handling: ", process.env.REACT_APP_GIF_API)
        superagent.get(url)
            .query({ api_key: `${process.env.REACT_APP_GIF_API}` })
            .then(function (superagentResults) {
                Data.results = superagentResults
                let workable = Data.results.body.data
                workable.forEach(el => {
                    console.log("FOREACH LOOP: ", el.images.downsized_small)

                    Data.set.push(el.images.downsized_small.mp4)
                    console.log(Data.set)
                })
                // console.log("does the state have movement?: ", gifArray)
            })
            .catch(function (error) {
                console.log('Womp Womp');
                // res.status(500).send('we messed up');
            })
    }

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

    //Displays the chat rooms
    const chatRooms = () => {
        return rooms.map((room, index) => (
            <div key={index}>
                <h3>
                    {room}
                </h3>
            </div>
        ))
    }

    //Users should be able to create own public rooms or private rooms to specific users
    const joinRoom = () => {
        socket.emit('join', { user: state.user, room: newRoom });
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

            <div className="chat-container">
                <div className="rooms">
                    <h2>Chat Rooms</h2>
                    {
                        rooms && (
                            <>
                                {chatRooms()}
                            </>
                        )
                    }
                </div>
                <div className="chat">
                    <h2>Chat</h2>
                    {chatWindow()}
                    <input placeholder="Enter a message" onChange={(e) => onChang(e)} value={state.message}></input>
                    <button onClick={sendMessage}>Send Message</button>
                </div>
                <div className="participants">
                    <h2>Chat Participants</h2>
                    {
                        participants && (
                            <>
                                {chatParticipants()}
                            </>
                        )
                    }
                </div>

            </div>


            <button onClick={Data.handleAPICall}>Giph Me</button>
            {/* <button onClick={joinRoom}>Join Main Room</button> */}
            <button onClick={leaveRoom}>Leave Room</button>

            <input type="text" placeholder="Enter Room Name" onChange={e => setNewRoom(e.target.value)} />
            <button onClick={joinRoom}>Create Room</button>
        </>
    )
}

export default Chat;