/*jshint esversion: 6 */

import React, { Component } from 'react';

import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'

class Home extends Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <img className="u-max-full-width" alt="emojify" src="/images/emojify.png" />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Home;