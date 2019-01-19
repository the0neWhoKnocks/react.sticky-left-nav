import React from 'react';
import Product from '../Product';

export default ({ items }) => (
  <div className="results">
    {items.map((item, ndx) => <Product key={ndx} {...item} />)}
  </div>
);
