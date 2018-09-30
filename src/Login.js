import React, { Component } from 'react';
import './Login.css';
import * as KeratinAuthN from 'keratin-authn/dist/keratin-authn';
import zxcvbn from 'zxcvbn/lib/main';

import Panel from 'react-bootstrap/lib/Panel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import Alert from 'react-bootstrap/lib/Alert';
import Button from 'react-bootstrap/lib/Button';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'

KeratinAuthN.setHost('http://localhost:8090');
KeratinAuthN.setLocalStorageStore("emojify");

function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}

class ErrorMessage extends Component {
  render() {
    return (
      <Alert bsStyle="danger">
        <strong>Error:</strong> {this.props.errorMessage}
      </Alert>
    );
  }
}

class PasswordStrength extends Component {
  timeout = null;

  constructor(props) {
    super(props);
    this.state = { strength: 0, style: "danger", warning: "", suggestions: "" };
  }

  componentWillReceiveProps(nextProps) {
    // if we receive a new password before checking previous strength clear
    var result = zxcvbn(nextProps.password);
    var style = "danger";
    var strength = 0;
    switch (result.score) {
      case 0:
      case 1:
        style = "danger"
        strength = 25;
        break;
      case 2:
        style = "warning"
        strength = 50
        break;
      case 3:
        style = "info"
        strength = 75
        break;
      case 4:
        style = "success";
        strength = 100;
        break;
      default:
    }

    var suggestions = "";
    if (result.feedback.suggestions.length > 0) {
      suggestions = result.feedback.suggestions.join('\n');
    }
    console.log(suggestions);

    this.setState({
      strength: strength,
      style: style,
      warning: result.feedback.warning,
      suggestions: suggestions
    })
  }

  render() {
    var warning = this.state.warning;
    var suggestions = this.state.suggestions;

    return (
      <div>
        Password strength
        < ProgressBar striped bsStyle={this.state.style} now={this.state.strength} />
        <strong>{warning}</strong>
        <div>{suggestions}</div><br />
      </div >
    );
  }
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleSignup = this.handleSignup.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.state = {
      showError: false,
      errorMessage: ""
    };
  }

  handleSignup(e) {
    const self = this;

    console.log("signup", this.state.username, this.state.password);
    KeratinAuthN.signup({ username: this.state.username, password: this.state.password })
      .then(function (val) {
        console.log("signup success");
        self.signupSuccess();
      }).catch(function (reason) {
        console.log("failed signup", reason);
        self.showError(reason);
      });
  }

  signupSuccess() {
    this.setState({ showError: false });
    this.props.onSignupChange(true);
  }

  showError(reason) {
    let errorMessage;
    switch (reason[0].message) {
      case "TAKEN":
        errorMessage = "Sorry this username is already taken";
        break;
      case "INSECURE":
        errorMessage = "Please use a secure password at least 10 characters in length and containing at least 2 symbols";
        break;
      default:
        errorMessage = "An unexpected error has occurred";
    }

    this.setState({ showError: true, errorMessage: errorMessage });
  }

  handleUsernameChange(e) {
    this.setState({ username: e.target.value });
  }

  handlePasswordChange(e) {
    console.log("password change");
    this.setState({ password: e.target.value });
  }

  render() {
    const showError = this.state.showError;
    let error;

    if (showError) {
      error = <ErrorMessage errorMessage={this.state.errorMessage} />
    }

    return (
      <Grid>
        <Row>
          <Col xs={12}>
            {error}
          </Col>
        </Row>
        <Row>
          <Col xs={3} xsOffset={4}>
            <Panel className="loginPanel">
              <Panel.Heading>
                <Panel.Title>Signup</Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                <form>
                  <FieldGroup
                    id="formControlsText"
                    type="email"
                    label="Username"
                    placeholder="Enter username"
                    onChange={this.handleUsernameChange}
                  />
                  <FieldGroup
                    id="formControlsText"
                    type="password"
                    label="Password"
                    placeholder="Enter password"
                    onChange={this.handlePasswordChange}
                  />
                  <PasswordStrength password={this.state.password} />
                  <Button bsStyle="primary" onClick={this.handleSignup}>Signup</Button>
                </form>
              </Panel.Body>
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Login;