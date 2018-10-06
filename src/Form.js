/*jshint esversion: 6 */
import React, { Component } from 'react';

import axios from 'axios';

import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Image from './Image.js';
import FieldGroup from './FieldGroup';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urlInput: ""
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log('Submit: ' + this.state.urlInput);
    var self = this;

    // set loading image
    self.setState({ imageURL: "/images/loading.png" });

    axios.post('/api', this.state.urlInput).then(function (response) {
      console.log(response);
      self.setState({ imageURL: "/api" + response.data });
    }).catch(function (error) {
      // handle error
      console.log(error);
      self.setState({ imageURL: "/images/sorry.png" });
    })
  }

  onChange(name, value) {
    this.setState({
      [name]: value.target.value,
    });
  }

  render() {
    return (
      <form>
        <Grid>
          <Row>
            <Col xs={12}>
              <Image src="/images/emojify.png" width={900} height={400} mode='fit'></Image>
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
