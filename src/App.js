/*jshint esversion: 6 */

import React, { Component } from 'react';
import './App.css';

import * as KeratinAuthN from 'keratin-authn/dist/keratin-authn';

import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';

import Login from './Login.js';
import SignUp from './SignUp.js';
import Home from './Home.js';
import Form from './Form.js';
import LoginButton from './LoginButton.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.handleSignUpLoginChange = this.handleSignUpLoginChange.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleHomeClick = this.handleHomeClick.bind(this);

    this.state = { event: "ShowHome", loginTitle: "Login", loggedIn: false };


    var host = process.env.REACT_APP_HOST
    if (host === undefined) {
      host = "http://api.xn--emjify-4v74e.ws"
    }

    console.log("host:", host);

    KeratinAuthN.setHost(host + '/auth');
    KeratinAuthN.setLocalStorageStore("emojify");
  }

  componentDidMount() {
    const self = this
    KeratinAuthN.restoreSession().then(() => {
      console.log("restoring session");
      self.setState({ event: "ShowForm", loginTitle: "Logout", loggedIn: true });
    }).catch(error => {
      console.log("error restoring session");
    });
  }

  handleHomeClick() {
    if (this.state.loggedIn === true) {
      this.setState({ event: "ShowForm" });
      return;
    }

    this.setState({ event: "ShowHome" });
  }

  handleSignUpLoginChange(event) {
    console.log("signup change");
    switch (event) {
      case "LoginSuccess":
        this.setState({ event: "ShowForm", loginTitle: "Logout", loggedIn: false });
        break;
      case "SignUpSuccess":
        this.setState({ event: "ShowForm", loginTitle: "Logout", loggedIn: true });
        break;
      case "ShowSignUp":
        this.setState({ event: "ShowSignUp" });
        break;
      case "ShowLogin":
        this.setState({ event: "ShowLogin" });
        break;
      default:
    }
  }

  handleLoginClick(event) {
    console.log("login click", event);
    switch (event) {
      case "Logout":
        KeratinAuthN.logout().then(() => {
          console.log("logout success");
          this.setState({ loginTitle: "Login", event: "ShowHome" });
        }).catch(error => {
          console.log("error signing out", error);
        });
        break;
      default:
        this.setState({ event: "ShowLogin" });
    }
  }

  render() {
    var eventElement = null;

    switch (this.state.event) {
      case "ShowLogin":
        console.log("show login");
        eventElement = <Login onResult={this.handleSignUpLoginChange} />;
        break;
      case "ShowSignUp":
        console.log("show signup");
        eventElement = <SignUp onResult={this.handleSignUpLoginChange} />;
        break;
      case "ShowForm":
        console.log("show form");
        eventElement = <Form />;
        break;
      default:
        console.log("show home");
        eventElement = <Home />;
    }

    return (
      <div>
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand onClick={this.homeClick}>
              Emojify
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              <LoginButton text={this.state.loginTitle} onClick={this.handleLoginClick} />
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {eventElement}
      </div >
    );
  }
}

export default App;