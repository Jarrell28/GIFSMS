
import React, { useState, useEffect } from 'react';

const io = require('socket.io-client');
require('dotenv').config();
const HOST = process.env.REACT_APP_HOST || 'http://localhost:3001';
const socket = io.connect(`${HOST}/gifs`);

let Chat = (props) => {

    const [state, setState] = useState({ message: '', user: 'admin' });
    const [chat, setChat] = useState([]);

    const onChang = (e) => {
        setState({ ...state, message: e.target.value })
    }

    useEffect(() => {
        //Notifies when user joines room
        socket.on('user joined', payload => {
            console.log(payload);
            setChat(arr => [...arr, { type: "notification", message: `User ${payload.user} has joined the room`, user: payload.user }])
        })

        //User has sent a message
        socket.on('message', payload => {
            console.log('messaged', payload)
            //Updates the chat message list
            setChat(arr => [...arr, { message: payload.message, user: payload.user }])
        });

        //Once User logs in, updates state for current user
        setState({ ...state, user: props.user });


        //Notifies when user leaves a room
        socket.on('user disconnected', payload => {
            console.log(payload);
            setChat(arr => [...arr, { type: "notification", message: `User ${payload.user} has left the room`, user: payload.user }])
        })

        //TODOS
        //Have user join main room after login
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
        </>
    )
}

export default Chat;

// class ChatWindow extends React.Component {
//     constructor(props){
//         super(props);
//         this.socket = socket
//         this.state = {
//             gifSearch: '',
//             searchArray:[]
//         }
//     }

//     componentDidMount(){
//         console.log("MOUNTING")
//         socket.emit('join', {name: "It'sa me" , room: "It'sa me" }).then(console.log('emitted'))

//     }

//     submitGif(e){
//         e.preventDefault();
//         const {message , user } = state
//         socket.emit('message', {message, user: user })
//         this.setState({message: '', user: 'admin'})
//     }


// render(){
//        socket.on('user joined', payload => {
//             this.props.setter(payload.user)

//             console.log("User Joined Room: ", payload.user); //Sends notification of user name that join
//         })
//         socket.on('message', payload => {
//             console.log(payload);
//         });
//     return (
//         <>
//         <div>
//             {this.state.searchArray.length>0
//             ? this.state.searchArray.forEach(el =>{
//                 return (
//                 <div>
//                     <img src={el.src} alt={el.alt} />
//                     <p>{el.username}</p>
//                 </div>
//             )
//             })
//             : <></>}
//         </div>
//         <input placeholder="what's you're moving mood?" onChange={(e) => this.setState({gifSearch: e.target.value})}></input>
//         <button onClick={e => submitGif(e)}>state change?</button>
//         </>
//     )
// }


// }


// export default ChatWindow