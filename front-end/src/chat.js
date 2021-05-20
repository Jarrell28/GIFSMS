import "./App.css";
import React, { useState, useEffect } from "react";
const superagent = require("superagent");
const io = require("socket.io-client");
require("dotenv").config();
const HOST = process.env.REACT_APP_HOST || "http://localhost:3001";
const socket = io.connect(`${HOST}/gifs`);

let Chat = ({ user }) => {
  const [state, setState] = useState({ message: "", user: "" });
  const [chat, setChat] = useState([]);
  const [gifArray, setGifArray] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState("");
  const [activeRoom, setActiveRoom] = useState("Main Room");

  const onChang = (e) => {
    setState({ ...state, message: e.target.value });
  };

  useEffect(() => {
    //Notifies when user joines room
    socket.on("user joined", (payload) => {
      console.log(payload);
      setChat((arr) => [
        ...arr,
        {
          type: "notification",
          message: `User ${payload.user} has joined the room`,
          user: payload.user,
        },
      ]);
    });

    //Receives list of participants from socket server
    socket.on("get participants", (payload) => {
      setParticipants(payload.participants);
    });

    //Receives list of rooms
    socket.on("get rooms", (payload) => {
      setRooms(payload.rooms);
    });

    //User has sent a message
    socket.on("message", (payload) => {
      console.log("messaged", payload);
      //Updates the chat message list
      setChat((arr) => [
        ...arr,
        { message: payload.message, user: payload.user },
      ]);
    });

    //Once User logs in, updates state for current user
    setState({ ...state, user });

    //Notifies when user leaves a room
    socket.on("user disconnected", (payload) => {
      console.log(payload);
      setChat((arr) => [
        ...arr,
        {
          type: "notification",
          message: `User ${payload.user} has left the room`,
          user: payload.user,
        },
      ]);
    });

    // eslint-disable-next-line
  }, []);

  // Have user join main room after login
  // load trending gifs to the gifArray
  useEffect(() => {
    if (state.user) {
      let rez = [];
      let url = `https://api.giphy.com/v1/gifs/trending?limit=5`;
      superagent
        .get(url)
        .query({ api_key: `${process.env.REACT_APP_GIF_API}` })
        .then(function (results) {
          let base = results.body.data;
          console.log("BAAAAASE: ", base);
          base.forEach((el) => {
            rez.push(el.images.fixed_width.url);
          });

          setGifArray((arr) => [...rez]);
        })
        .catch(function (error) {
          console.log("Womp Womp", error);
          // res.status(500).send('we messed up');
        });
      socket.emit("join", { user: state.user, room: "Main Room" });
    }
  }, [state.user]);

  // method to fetch Giphy API on chat input
  const Data = { set: [] };
  Data.handleAPICall = async (req, res) => {
    const url = `https://api.giphy.com/v1/gifs/search?q=${state.message}&limit=5`;
    superagent
      .get(url)
      .query({ api_key: `${process.env.REACT_APP_GIF_API}` })
      .then(function (superagentResults) {
        Data.results = superagentResults;
        let workable = Data.results.body.data;
        workable.forEach((el) => {
          Data.set.push(el.images.fixed_width.url);
        });
        setGifArray((arr) => [...Data.set]);
        Data.set = [];
      })
      .catch(function (error) {
        console.log("Womp Womp", error);
      });
  };

  //"translate" API call to Giphy
  const gamble = async (req, res) => {
    const url = `https://api.giphy.com/v1/gifs/translate?s=${state.message}`;
    superagent
      .get(url)
      .query({ api_key: `${process.env.REACT_APP_GIF_API}` })
      .then(function (superagentResults) {
        let workable = superagentResults.body.data;
        socket.emit("message", {
          message: workable.images.fixed_width.url,
          user: state.user,
          room: activeRoom,
        });
      })
      .catch(function (error) {
        console.log("Womp Womp");
        // res.status(500).send('we messed up');
      });
  };

  //method for images to send on click
  const clickMe = (e) => {
    e.preventDefault();
    socket.emit("message", {
      message: e.target.src,
      user: state.user,
      room: activeRoom,
    });
  };

  //function to render the gifs from api call
  const gifWindow = (data) => {
    console.log("Gif Window: ", data);
    return data.map((el) => (
      <div className="gif-prev">
        <img src={el} alt={el} onClick={(e) => clickMe(e)} />
      </div>
    ));
  };

  //Displays the chat messages
  const chatWindow = () => {
    return chat.map(({ message, user, type }, index) =>
      type === "notification" ? (
        <div key={index}>
          <h4>{message}</h4>
        </div>
      ) : (
        <div key={index}>
          <h2>
            {user}: <img alt={index} src={message} />
          </h2>
        </div>
      )
    );
  };

  //Displays the participants
  const chatParticipants = () => {
    return participants.map((user, index) => (
      <div key={index}>
        <h3>{user}</h3>
      </div>
    ));
  };

  //Displays the chat rooms
  const chatRooms = () => {
    return rooms.map((room, index) => (
      <div key={index} onClick={switchRoom}>
        <h3 room={room}>
          {room} {room === activeRoom ? " - active" : ""}
        </h3>
      </div>
    ));
  };

  //remove yourself from one room and add to another
  const switchRoom = (e) => {
    let selectedRoom = e.target.getAttribute("room");
    if (activeRoom !== selectedRoom) {
      if (activeRoom) {
        socket.emit("leave", { user: state.user, room: activeRoom });
      }

      setChat([]);
      socket.emit("join", { user: state.user, room: selectedRoom });
      setActiveRoom(selectedRoom);
    }
  };

  //Users should be able to create own public rooms or private rooms to specific users
  const joinRoom = () => {
    setChat([]);
    socket.emit("join", { user: state.user, room: newRoom });
    setActiveRoom(newRoom);
  };

  //leave room and update current room
  const leaveRoom = () => {
    socket.emit("leave", { user: state.user, room: activeRoom });
    setActiveRoom("");
  };

  //I want to press enter to submit
  const ent = (e) => {
    if (e.key === "Enter") {
      Data.handleAPICall();
    }
  };

  return (
    <>
      <div className="chat-container">
        <div className="side-nav">
          <div className="rooms">
            <h2>Chat Rooms</h2>
            {rooms && <>{chatRooms()}</>}
            <input
              type="text"
              placeholder="Enter Room Name"
              onChange={(e) => setNewRoom(e.target.value)}
            />
            <button onClick={joinRoom}>Create Room</button>
            <button onClick={leaveRoom}>Leave Room</button>
          </div>
          <div className="participants">
            <h2>Chat Participants</h2>
            {participants && <>{chatParticipants()}</>}
          </div>
        </div>
        <div className="chat">
          <h2>Chat</h2>
          <div className="chatArea">{chatWindow()}</div>
        </div>

        <div className="searcher">
          <div className="search-side">
            <h2>Go Giff Yourself</h2>
          </div>
          <input
            placeholder="Move Me"
            onChange={(e) => onChang(e)}
            onKeyDown={(e) => ent(e)}
            value={state.message}
          ></input>
          <button onClick={Data.handleAPICall}>Giph Me</button>
          <button onClick={gamble}>Giph Me Harder</button>

          <div className="gifTown">{gifWindow(gifArray)}</div>
        </div>
      </div>
    </>
  );
};

export default Chat;
