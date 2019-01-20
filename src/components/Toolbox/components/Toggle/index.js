import React from 'react';

export default ({
  label,
  onChange,
  toggled,
}) => (
  <label>
    {label}
    <input type="checkbox" onChange={onChange} checked={toggled}/>
  </label>
);
