/*jshint esversion: 6 */
import React, { Component } from 'react';

import './Login.css';

import * as KeratinAuthN from 'keratin-authn/dist/keratin-authn';

import ErrorMessage from './ErrorMessage';
import LoginForm from './LoginForm';
import Panel from 'react-bootstrap/lib/Panel';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSignUpClick = this.handleSignUpClick.bind(this);

    this.state = {
      showError: false,
      errorMessage: ""
    };
  }

  handleLogin(e) {
    const self = this;
    KeratinAuthN.login({ username: this.state.username, password: this.state.password })
      .then(function (val) {
        console.log("signup success");
        self.signUpSuccess();
      }).catch(function (reason) {
        console.log("failed signup", reason);
        self.showError(reason);
      });
  }

  signUpSuccess() {
    this.setState({ showError: false });
    this.props.onResult("LoginSuccess");
  }

  showError(reason) {
    console.log(reason);
    let errorMessage;
    switch (reason[0].message) {
      case "FAILED":
        errorMessage = <div>Incorrect username or password, to sign up please click here: <a onClick={this.handleSignUpClick}>Sign up</a></div>
        break;
      default:
        errorMessage = "An unexpected error has occurred";
    }

    this.setState({ showError: true, errorMessage: errorMessage });
  }

  handleUsernameChange(value) {
    this.setState({ username: value });
  }

  handlePasswordChange(value) {
    this.setState({ password: value });
  }

  handleSignUpClick() {
    this.props.onResult("ShowSignUp");
  }

  render() {
    let error;
    if (this.state.showError) {
      error = <ErrorMessage errorMessage={this.state.errorMessage} />
    }

    return (
      <Grid>
        <Row>
          <Col md={12}>
            {error}
          </Col>
        </Row>
        <Row>
          <Col md={6} mdOffset={4}>
            <Panel className="loginPanel">
              <Panel.Heading>
                <Panel.Title>Login</Panel.Title>
                Login to Emojify using your email address and password
              </Panel.Heading>
              <Panel.Body>
                <form>
                  <LoginForm onUsernameChange={this.handleUsernameChange} onPasswordChange={this.handlePasswordChange} />
                  <Row>
                    <Col md={2}>
                      <Button bsStyle="primary" onClick={this.handleLogin}>Login</Button>
                    </Col>
                    <Col md={2}>
                      <Button className="pull-right" bsStyle="danger" onClick={this.handleSignUpClick}>SignUp</Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>&nbsp;</Col>
                  </Row>
                  <Row>
                    <Col md={6} >
                      <Button href="{this.props.oAuthURI}" block bsStyle="danger">Login with Github</Button>
                    </Col>
                  </Row>
                </form>
              </Panel.Body>
            </Panel>
          </Col>
        </Row >
      </Grid >
    );
  }
}

export default Login;
