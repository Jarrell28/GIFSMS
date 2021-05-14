
import { createSocket } from 'node:dgram';
import React from 'react';

const io = require('socket.io-client');
require('dotenv').config();
const HOST = REACT_APP_HOST
const socket = io.connect(`${HOST}/gifs`);





class ChatWindow extends React.Component {
    constructor(props){
        super(props);
        // this.socket = socket
        this.state = {
            gifSearch: '',
            searchArray:[]
        }
    }

    componentDidMount(){
        
        
        socket.emit('join', {name: this.props.profile, room: this.props.profile.username})}



// ChatLog(array) {

//     let logs = array.forEach(el =>{
//         if (this.state.searchArray.length>0){
//             return (
//             <div>
//                 <img src={el.src} />
//                 <p>{el.username}</p>
//             </div>
//         )
//         }
//     })

//     return logs

// }

render(){
    
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
        <button onClick={(e) => console.log(this.state.gifSearch)}>state change?</button>
        </>
    )
}


}


export default ChatWindow