/*jshint esversion: 6 */
import React, { Component } from 'react';

import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import zxcvbn from 'zxcvbn/lib/main';

class PasswordStrength extends Component {
  previousProps = null;

  constructor(props) {
    super(props);
    this.state = { strength: 0, style: "danger", warning: "", suggestions: [] };
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

    var suggestions = [];
    if (result.feedback.suggestions !== undefined) {
      suggestions = result.feedback.suggestions;
    }

    this.setState({
      strength: strength,
      style: style,
      suggestions: suggestions,
      warning: result.feedback.warning
    })
  }

  render() {
    var warning = <h4>{this.state.warning}</h4>

    return (
      <div>
        <strong>Password strength</strong>
        <ProgressBar style={{ height: '40px' }} striped bsStyle={this.state.style} now={this.state.strength} />
        <strong>{warning}</strong>
        <Grid>
          {this.state.suggestions.map((suggestion, index) => <Row key={index}><Col>{suggestion}</Col></Row>)}
        </Grid>
      </div>
    )
  }
};

export default PasswordStrength;