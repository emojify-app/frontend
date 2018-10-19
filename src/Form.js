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
import Fade from 'react-bootstrap/lib/Fade';

class Form extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePayment = this.handlePayment.bind(this);

    this.state = { urlInput: "", showLogo: true, showPayment: false };
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log('Submit: ' + this.state.urlInput);
    var self = this;

    // set loading image
    self.setState({ imageURL: "/images/loading.png", showLogo: false, loading: true });
    let headers = { Authorization: "jwt " + KeratinAuthN.session() };

    var showPayment = window.env.config.PAYMENT_ENABLED;

    axios.post(window.env.config.API_URL, this.state.urlInput, { headers: headers }).then(function (response) {
      console.log(response);
      self.setState({ imageURL: window.env.config.API_URL + '/cache?file=' + response.data, showPayment: showPayment });
    }).catch(function (error) {
      // handle error
      console.log(error);
      self.setState({ imageURL: "/images/sorry.png" });
    });
  }

  handleChange(e) {
    this.setState({ urlInput: e.target.value });
  }

  handlePayment(e) {
    this.props.onResult("PaymentClicked");
  }

  render() {
    let randomDollars = Math.round(Math.random() * 70 + 10);
    let randomCents = Math.round(Math.random() * 100);

    var buyNow = null;
    if (this.state.showPayment) {
      buyNow =
        <div>
          <Row>
            <Col md={12} className="text-center"><h3>Buy a 16x10 high gloss photo of this image for only <b>${randomDollars}.{randomCents}</b></h3></Col>
          </Row>
          <Row>
            <Col xs={12}>
              &nbsp;
            </Col>
          </Row>
          <Row>
            <Col md={6} mdOffset={3}>
              <Button bsStyle="danger" bsSize="large" block onClick={this.handlePayment}>Buy Now!</Button>
            </Col>
          </Row>
        </div>;
    }

    var logo = null;
    if (this.state.showLogo) {
      logo =
        <Row>
          <Col xs={12}>
            <Image src="/images/emojify.png" width={900} height={300} mode='fit' />
          </Col>
        </Row>;
    }

    var input = null;
    if (!this.state.showPayment) {
      input =
        <div>
          <Row>
            <Col xs={12}>
              <FieldGroup
                id="urlInput"
                type="text"
                label="Image URL"
                placeholder="http://image.com/image.png"
                onChange={this.handleChange}
                bsSize="large"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Button bsStyle="success" bsSize="large" onClick={this.handleSubmit}>Submit</Button>
            </Col>
          </Row>
        </div>;
    }

    return (
      <form>
        <Grid>
          {logo}
          <Row>
            <Col xs={12}>
              <Fade in={this.state.loading}>
                <Image src={this.state.imageURL} width={1200} height={600} mode='fit' />
              </Fade>
            </Col>
          </Row>
          {input}
          <Row>
            <Col xs={12}>
              &nbsp;
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              &nbsp;
            </Col>
          </Row>
          {buyNow}
        </Grid>
      </form >
    );
  }
}

export default Form;
