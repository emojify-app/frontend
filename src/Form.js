/*jshint esversion: 6 */ 

import React, { Component } from 'react';
import Image from './Image.js';
import axios from 'axios';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urlInput: ""
    };
  }

  onSubmit(e) {
    e.preventDefault();
    console.log('Submit: ' + this.state.urlInput);
    var self = this;

    // set loading image
    self.setState({imageURL: "/images/loading.png"});

    axios.post('/api',this.state.urlInput).then(function (response) {
      console.log(response);
      self.setState({imageURL: "/api" + response.data});
    }).catch(function (error) {
      // handle error
      console.log(error);
      self.setState({imageURL: "/images/sorry.png"});
    })
  }

  onChange(name, value) {
    this.setState({
      [name]: value.target.value,
    });
  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
      <div className="row" style={{ paddingBottom: '20px' }}>
        <div className="twelve column">
          <Image src={this.state.imageURL} width={900} height={400} mode='fit' /> 
        </div>
      </div>
      <div className="row">
        <div className="twelve column">
          <label htmlFor="urlInput">Image URL</label>
          <input className="u-full-width" type="text" placeholder="http://image.com" id="urlInput" onChange={this.onChange.bind(this, 'urlInput')}/>
        </div>
      </div>
      <div className="row">
        <div className="twelve column">
          <input className="button-primary" type="submit" value="Submit"/>
        </div>
      </div>
      </form>
    );
  }
}

export default Form;
