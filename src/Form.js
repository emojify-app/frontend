/*jshint esversion: 6 */
import React, { Component } from 'react';

import axios from 'axios';
import * as KeratinAuthN from 'keratin-authn/dist/keratin-authn';

import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Image from './Image.js';
import FieldGroup from './FieldGroup';

class Form extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = { urlInput: "" };
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log('Submit: ' + this.state.urlInput);
    var self = this;

    // set loading image
    self.setState({ imageURL: "/images/loading.png" });
    let headers = { Authorization: "jwt " + KeratinAuthN.session() };

    axios.post(window.env.config.API_URL + '/api', this.state.urlInput, { headers: headers }).then(function (response) {
      console.log(response);
      self.setState({ imageURL: window.env.config.API_URL + '/api/cache?file=' + response.data });
    }).catch(function (error) {
      // handle error
      console.log(error);
      self.setState({ imageURL: "/images/sorry.png" });
    });
  }

  handleChange(e) {
    this.setState({ urlInput: e.target.value });
  }

  render() {
    return (
      <form>
        <Grid>
          <Row>
            <Col xs={12}>
              <Image src="/images/emojify.png" width={900} height={400} mode='fit'/>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Image src={this.state.imageURL} width={900} height={400} mode='fit' />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <FieldGroup
                id="urlInput"
                type="text"
                label="Image URL"
                placeholder="http://image.com/image.png"
                onChange={this.handleChange}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Button bsStyle="primary" onClick={this.handleSubmit}>Submit</Button>
            </Col>
          </Row>
        </Grid>
      </form>
    );
  }
}

export default Form;
