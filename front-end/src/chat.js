

import React from 'react';

const io = require('socket.io-client');
require('dotenv').config();
const HOST = process.envREACT_APP_HOST || 'http://localhost:3001';
const socket = io.connect(`http://localhost:3001/gifs`);


 


class ChatWindow extends React.Component {
    constructor(props){
        super(props);
        this.socket = socket
        this.state = {
            gifSearch: '',
            searchArray:[]
        }
    }

    componentDidMount(){
        console.log("MOUNTING")
        socket.emit('join', {name: "It'sa me" , room: "It'sa me" }).then(console.log('emitted'))
     
    }

    submitGif(e){
        e.preventDefault();
        socket.emit('message', { message: this.state.gifSearch, user: "It'sa me" });
    }


render(){
       socket.on('user joined', payload => {
            this.props.setter(payload.user)
            console.log("User Joined Room: ", payload.user); //Sends notification of user name that join
        })
        socket.on('message', payload => {
            console.log(payload);
        });
    return (
        <>
        <div>
            {this.state.searchArray.length>0
            ? this.state.searchArray.forEach(el =>{
                return (
                <div>
                    <img src={el.src} alt={el.alt} />
                    <p>{el.username}</p>
                </div>
            )
            })
            : <></>}
        </div>
        <input placeholder="what's you're moving mood?" onChange={(e) => this.setState({gifSearch: e.target.value})}></input>
        <button onClick={socket.emit('join', {name: "It'sa me" , room: "It'sa me" })}>state change?</button>
        </>
    )
}


}


export default ChatWindow