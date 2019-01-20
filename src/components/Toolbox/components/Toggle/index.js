import React from 'react';

export default ({
  label,
  onChange,
  toggled,
}) => (
  <label>
    <span className="label-text">{label}</span>
    <input type="checkbox" onChange={onChange} checked={toggled}/>
  </label>
);
