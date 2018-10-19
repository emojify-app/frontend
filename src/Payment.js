
import React, { Component } from 'react';

import axios from 'axios';
import * as KeratinAuthN from 'keratin-authn/dist/keratin-authn';

import FieldGroup from './FieldGroup';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Card from 'react-credit-cards';
import ErrorMessage from './ErrorMessage';

import 'react-credit-cards/es/styles-compiled.css';

class Payment extends Component {
  constructor(props) {
    super(props);

    this.handlePay = this.handlePay.bind(this);
    this.autoEnter = this.autoEnter.bind(this);

    this.state = {
      number: '',
      name: '',
      expiry: '',
      cvc: '',
      issuer: '',
      focused: '',
      formData: null,
    };
  }

  handleInputFocus = ({ target }) => {
    this.setState({
      focused: target.name,
    });
  };

  handleInputChange = ({ target }) => {
    /*
        if (target.name === 'number') {
          target.value = formatCreditCardNumber(target.value);
        } else if (target.name === 'expiry') {
          target.value = formatExpirationDate(target.value);
        } else if (target.name === 'cvc') {
          target.value = formatCVC(target.value);
        }
        */

    this.setState({ [target.name]: target.value });
  };

  handlePay(e) {
    console.log("Pay");

    let headers = { Authorization: "jwt " + KeratinAuthN.session() };
    let payload = {
      name: this.state.name,
      number: this.state.number,
      cvc: this.state.cvc,
      expiry: this.state.expiry
    };

    let self = this;
    axios.post(window.env.config.PAYMENT_URL, payload, { headers: headers }).then(function (response) {
      console.log(response);
      var responseMessage =
        <p>
          <strong>Error: Payment failed</strong>
          <br></br>
          {response.data.message}, reference id: {response.data.id}
        </p >;

      self.setState({ errorMessage: responseMessage, showError: true });
    }).catch(function (error) {
      console.log(error);
      self.setState({ errorMessage: "Payment failed", showError: true });
    });
  };

  sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  async autoEnter() {
    var n;
    var val;

    var ccnumber = "5355 1234 4231 1234";
    for (n = 0; n < ccnumber.length + 1; n++) {
      val = ccnumber.substr(0, n);
      this.setState({ number_value: val, number: val });
      await this.sleep(100);
    }

    var ccname = "Mr Paul Banks";
    for (n = 0; n < ccname.length + 1; n++) {
      val = ccname.substr(0, n);
      this.setState({ name_value: val, name: val });
      await this.sleep(100);
    }

    var ccexpiry = "10/20";
    for (n = 0; n < ccexpiry.length + 1; n++) {
      val = ccexpiry.substr(0, n);
      this.setState({ expiry_value: val, expiry: val });
      await this.sleep(100);
    }

    this.setState({ focused: "cvc" });
    var cccvc = "123";
    for (n = 0; n < cccvc.length + 1; n++) {
      val = cccvc.substr(0, n);
      this.setState({ cvc_value: val, cvc: val });
      await this.sleep(100);
    }

    await this.sleep(1500);
    this.setState({ focused: "number" });
  }

  render() {
    var error = null;
    if (this.state.showError) {
      error = <ErrorMessage errorMessage={this.state.errorMessage} />
    }

    const { name, number, expiry, cvc, focused } = this.state;
    return (
      <Grid>
        <Row>
          <Col md={12}>
            {error}
          </Col>
        </Row>
        <Row>
          <Col md={6} mdOffset={3}>
            <Panel className="loginPanel">
              <Panel.Heading>
                <Panel.Title onClick={this.autoEnter}><h3>Payment</h3></Panel.Title>
                <h4>You are about to pay Emojify Ltd the sum of <strong>{this.props.price}</strong>, please enter your payment details.</h4>
              </Panel.Heading>
              <Panel.Body>
                <form>
                  <Row>
                    <Col>
                      <Card
                        number={number}
                        name={name}
                        expiry={expiry}
                        cvc={cvc}
                        focused={focused}
                        callback={this.handleCallback}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <FieldGroup
                        id="formControlsText"
                        type="tel"
                        name="number"
                        label="Card Number"
                        placeholder="e.g. 1234 1231 1214 1211"
                        onChange={this.handleInputChange}
                        onFocus={this.handleInputFocus}
                        value={this.state.number_value}
                        bsSize="large"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <FieldGroup
                        id="formControlsText"
                        type="text"
                        name="name"
                        label="Card Name"
                        placeholder="e.g. Mr Paul Banks"
                        onChange={this.handleInputChange}
                        onFocus={this.handleInputFocus}
                        value={this.state.name_value}
                        bsSize="large"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FieldGroup
                        id="formControlsText"
                        type="tel"
                        name="expiry"
                        label="Expiry Date"
                        pattern="\d\d/\d\d"
                        placeholder="e.g. 01/20"
                        onChange={this.handleInputChange}
                        onFocus={this.handleInputFocus}
                        value={this.state.expiry_value}
                        bsSize="large"
                      />
                    </Col>
                    <Col md={6}>
                      <FieldGroup
                        id="formControlsText"
                        type="tel"
                        name="cvc"
                        label="CVC Number"
                        pattern="\d{3,4}"
                        placeholder="e.g. 123"
                        onChange={this.handleInputChange}
                        onFocus={this.handleInputFocus}
                        value={this.state.cvc_value}
                        bsSize="large"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <Button bsSize="large" block bsStyle="danger" onClick={this.handlePay}>Pay</Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>&nbsp;</Col>
                  </Row>
                </form>
              </Panel.Body>
            </Panel>
          </Col>
        </Row >
      </Grid >
    );
  }
}

export default Payment;