/*jshint esversion: 6 */

import React, { Component } from 'react';
import './App.css';

import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';


import Login from './Login.js'
import Home from './Home.js'
import Form from './Form.js'

class App extends Component {
  constructor(props) {
    super(props);

    this.handleSignupChange = this.handleSignupChange.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.state = { event: null };
  }

  handleSignupChange(success) {
    this.setState({ event: "ShowForm" });
  }

  handleLoginClick() {
    this.setState({ event: "ShowSignUp" });
  }

  render() {
    var eventElement = null;

    switch (this.state.event) {
      case "ShowSignUp":
        eventElement = <Login onSignupChange={this.handleSignupChange} />;
        break;
      case "ShowForm":
        eventElement = <Form />;
        break;
      default:
        eventElement = <Home />;
    }

    return (
      <div>
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#brand">Emojify</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              <NavItem onClick={this.handleLoginClick}>
                Login
            </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {eventElement}
      </div >
    );
  }
}

export default App;