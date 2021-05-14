// import logo from './logo.svg';
import './App.css';
import Chat from './chat.js'
import Login from './login.js'
import { withAuth0 } from '@auth0/auth0-react';
import React from 'react';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      user: {}
    }
  }
render() {
return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
      </header>
      <body>
        {!this.props.auth0.isAuthenticated
        ? <Login />
        : <Chat profile={this.user} />}
      </body>
    </div>
  );
}
  
}

export default withAuth0(App);
