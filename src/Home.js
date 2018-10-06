/*jshint esversion: 6 */

import React, { Component } from 'react';

import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import Image from './Image';

class Home extends Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <Image src="/images/emojify.png" width={900} height={400} mode='fit'></Image>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Home;