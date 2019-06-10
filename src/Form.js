/*eslint no-extend-native: ["error", { "exceptions": ["String"] }]*/
/*jshint esversion: 6 */

import React, { Component } from 'react';

import axios from 'axios';
import * as KeratinAuthN from 'keratin-authn/dist/keratin-authn';

import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Image from 'react-bootstrap/lib/Image';
import FieldGroup from './FieldGroup';

String.prototype.rpad = function (padString, length) {
  var str = this;
  while (str.length < length)
    str += padString;
  return str;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class Form extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePayment = this.handlePayment.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);

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

    axios.post(window.env.config.API_URL + "emojify/", this.state.urlInput, { headers: headers }).then(function (response) {
      console.log(response);
      // we should have an id an status check to see if complete
      if (response.data.status === "FINISHED") {
        self.setState({ imageURL: window.env.config.API_URL + 'cache/' + response.data.id, showPayment: showPayment });
      } else {
        // start polling
        self.pollImage(response.data.id, 0);
      }
    }).catch(function (error) {
      // handle error
      console.log(error);
      self.setState({ imageURL: "/images/sorry.png" });
    });
  }

  pollImage(id, c) {
    var self = this;
    // poll until complete
    sleep(5000).then(() => {
      console.log("polling queue ", c);
      axios.get(window.env.config.API_URL + "emojify/" + id).then(function (response) {
        console.log(response);
        if (response.data.status === "FINISHED") {
          self.setState({ imageURL: window.env.config.API_URL + 'cache/' + response.data.id });
        } else {
          if (c + 1 < 100) {
            // try again
            self.pollImage(id, c + 1);
          } else {
            // retry exceeded
            self.setState({ imageURL: "/images/sorry.png" });
          }
        }
      }).catch(function (error) {
        self.setState({ imageURL: "/images/sorry.png" });
      });

    });

  }

  handleChange(e) {
    this.setState({ urlInput: e.target.value });
  }

  handlePayment(e) {
    this.props.onResult("PaymentClicked", { price: e.target.value });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSubmit(e)
    }
  }

  render() {
    var randomDollars = (Math.round(Math.random() * 70 + 10) + "").rpad("0", 2);
    var randomCents = (Math.round(Math.random() * 100) + "").rpad("0", 2);

    let price = "$" + randomDollars + "." + randomCents;

    var buyNow = null;
    if (this.state.showPayment) {
      buyNow =
        <Row>
          <Col md={12} className="text-center"><h3>Buy a 16x10 high gloss photo of this image for only <b>{price}</b></h3>
            <Button bsStyle="danger" bsSize="large" block value={price} onClick={this.handlePayment}>Buy Now!</Button>
          </Col>
        </Row>;
    }

    var logo = null;
    if (this.state.showLogo) {
      logo =
        <Row>
          <Col xs={12}>
            <Image src="/images/emojify.png" responsive style={{ margin: "0 auto" }} />
          </Col>
        </Row>;
    }

    var input = null;
    if (!this.state.showPayment) {
      input =
        <Row>
          <Col xs={12}>
            <FieldGroup
              id="urlInput"
              type="text"
              label="Image URL"
              placeholder="http://image.com/image.png"
              onChange={this.handleChange}
              onKeyPress={this.handleKeyPress}
              bsSize="large"
            />
            <Button bsStyle="success" bsSize="large" onClick={this.handleSubmit}>Submit</Button>
          </Col>
        </Row >;
    }

    return (
      <form>
        <Grid>
          {logo}
          <Row>
            <Col xs={12}>
              <Image src={this.state.imageURL} responsive style={{ margin: "0 auto" }} />
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
