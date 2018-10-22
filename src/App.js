/*jshint esversion: 6 */

import React, { Component } from 'react';
import './App.css';

import * as KeratinAuthN from 'keratin-authn/dist/keratin-authn';

import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';

import Grid from "react-bootstrap/lib/Grid";
import Row from "react-bootstrap/lib/Row";
import Col from "react-bootstrap/lib/Col";

import Login from './Login.js';
import SignUp from './SignUp.js';
import Home from './Home.js';
import Form from './Form.js';
import Payment from './Payment.js';
import LoginButton from './LoginButton.js';
import Image from 'react-bootstrap/lib/Image';
import MediaQuery from 'react-responsive';

class App extends Component {
  constructor(props) {
    super(props);

    this.handleSignUpLoginChange = this.handleSignUpLoginChange.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleHomeClick = this.handleHomeClick.bind(this);

    var event = "ShowHome";
    if (window.env.config.AUTH_DISABLED) {
      event = "ShowForm";
    }

    this.state = {
      event: event,
      loginTitle: "Login",
      loggedIn: false,
      oAuthURI: window.env.config.AUTH_URL + "/oauth/github?redirect_uri=" + window.env.config.HOME_URL,
      oAuthEnabled: window.env.config.OAUTH_ENABLED,
    };

    console.log("auth:", window.env.config.AUTH_URL);
    console.log("api:", window.env.config.API_URL);
    console.log("home:", window.env.config.HOME_URL);

    KeratinAuthN.setHost(window.env.config.AUTH_URL);
    KeratinAuthN.setCookieStore("authn");
    //KeratinAuthN.setLocalStorageStore("emojify");
  }

  componentDidMount() {
    const self = this;
    KeratinAuthN.importSession().then(() => {
      console.log("restoring session");
      self.setState({ event: "ShowForm", loginTitle: "Logout", loggedIn: true });
    }).catch(error => {
      console.log("error restoring session: ", error);
    });
  }

  handleHomeClick() {
    console.log("home click");
    if (this.state.loggedIn === true || window.env.config.AUTH_DISABLED === true) {
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

  handleFormChange(event, props) {
    switch (event) {
      case "PaymentClicked":
        this.setState({ event: "ShowPayment", price: props.price });
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
        eventElement = <Login oAuthEnabled={this.state.oAuthEnabled} oAuthURI={this.state.oAuthURI} onResult={this.handleSignUpLoginChange} />;
        break;
      case "ShowSignUp":
        console.log("show signup");
        eventElement = <SignUp onResult={this.handleSignUpLoginChange} />;
        break;
      case "ShowForm":
        console.log("show form");
        eventElement = <Form onResult={this.handleFormChange} />;
        break;
      case "ShowPayment":
        console.log("show payment");
        eventElement = <Payment price={this.state.price} />;
        break;
      default:
        console.log("show home");
        eventElement = <Home />;
    }

    var loginButton = <LoginButton text={this.state.loginTitle} onClick={this.handleLoginClick} />;
    if (window.env.config.AUTH_DISABLED) {
      loginButton = null;
    }

    var smallLogoSrc = "/images/emojify_small.png"
    if (window.env.config.PAYMENT_ENABLED) {
      smallLogoSrc = "/images/emojify_ent_small.png"
    }

    return (
      <div>
        <Navbar inverse collapseOnSelect>
          <Navbar.Header >
            <Image onClick={this.handleHomeClick} src={smallLogoSrc} style={{ paddingTop: "10px" }} responsive />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {loginButton}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div style={{ flex: "1 0 auto" }}>
          {eventElement}
        </div>
        <MediaQuery minHeight={1000} minWidth={1000}>
          <Navbar fixedBottom>
            <Grid>
              <Row>
                <Col md={4}><Image src="/images/consul.png" width={250} /></Col>
                <Col md={4} className="text-center"><Image src="/images/machinebox.png" width={250} /></Col>
                <Col md={4}><Image className="pull-right" src="/images/emojione.png" width={250} /></Col>
              </Row>
            </Grid>
          </Navbar>
        </MediaQuery>
      </div >
    );
  }
}

export default App;
