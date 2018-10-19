/*jshint esversion: 6 */
import React, { Component } from 'react';

import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import zxcvbn from 'zxcvbn/lib/main';

class PasswordStrength extends Component {
  previousProps = null;

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
        <strong>Password strength</strong>
        <ProgressBar style={{ height: '40px' }} striped bsStyle={this.state.style} now={this.state.strength} />
        <strong>{warning}</strong>
        <div>{suggestions}</div><br />
      </div >
    );
  }
}

export default PasswordStrength;