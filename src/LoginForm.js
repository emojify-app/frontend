
import React, { Component } from 'react';
import FieldGroup from './FieldGroup';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleUsernameChange(e) {
    this.props.onUsernameChange(e.target.value);
  }

  handlePasswordChange(e) {
    this.props.onPasswordChange(e.target.value);
  }

  render() {
    return (
      <div>
        <FieldGroup
          id="formControlsText"
          type="email"
          label="Email"
          placeholder="Enter email address"
          onChange={this.handleUsernameChange}
          bsSize="large"
        />
        <FieldGroup
          id="formControlsText"
          type="password"
          label="Password"
          placeholder="Enter password"
          onChange={this.handlePasswordChange}
          bsSize="large"
        />
      </div>
    );
  }
}

export default LoginForm;