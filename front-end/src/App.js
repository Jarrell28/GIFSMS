
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

  userSetter(info) {
    this.setState({user: {info}})
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
        : <Chat profile={this.user} setter={this.userSetter} />}
      </body>
    </div>
  );
}
  
}

export default withAuth0(App);
