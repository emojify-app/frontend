
import React, { Component } from 'react';
import NavItem from 'react-bootstrap/lib/NavItem';

class LoginButton extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onClick(this.props.text);
  }

  render() {
    return (
      <NavItem onClick={this.handleClick}>
        <h4>{this.props.text}</h4>
      </NavItem>
    )
  }
}

export default LoginButton;