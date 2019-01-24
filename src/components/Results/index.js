import React, { forwardRef } from 'react';
import Product from '../Product';

export default forwardRef(({ items }, ref) => (
  <div className="results" ref={ref}>
    {items.map((item, ndx) => <Product key={ndx} {...item} />)}
  </div>
));
