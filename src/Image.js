/*jshint esversion: 6 */ 

import React, {Component} from 'react';

export default class Image extends Component {  
  render() {
    let {mode, src, height, width, style, ...props} = this.props;
    let modes = {
      'fill': 'cover',
      'fit': 'contain'
    };
    let size = modes[mode] || 'contain';
    var display = "none";

    if (src !== undefined && src.length > 1) {
      display = "block";
    }

    let defaults = {
      height: height || 100,
      width: width || 100,
      backgroundColor: 'white'
    };

    let important = {
      backgroundImage: `url("${src}")`,
      backgroundSize: size,
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      display: display,
      margin: "0 auto"
    };

    return <div {...props} style={{...defaults, ...style, ...important}} />;
  }
}
