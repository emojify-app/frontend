/*jshint esversion: 6 */
import React, { Component } from 'react';

import Alert from 'react-bootstrap/lib/Alert';

class ErrorMessage extends Component {
  render() {
    return (
      <Alert bsStyle="danger">
        <h3><strong>Error:</strong> {this.props.errorMessage}</h3>
      </Alert>
    );
  }
}

export default ErrorMessage;