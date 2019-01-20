import React, { Component } from 'react';

class Number extends Component {
  constructor() {
    super();

    this.sanitize = this.sanitize.bind(this);
  }

  sanitize(ev) {
    const {
      min,
      onChange,
    } = this.props;
    const val = +ev.currentTarget.value;

    onChange( (val < min) ? min : val );
  }

  render() {
    const {
      label,
      value,
    } = this.props;

    return (
      <label>
        <span className="label-text">{label}</span>
        <input type="number" onChange={this.sanitize} value={value}/>
      </label>
    );
  }
}

export default Number;
