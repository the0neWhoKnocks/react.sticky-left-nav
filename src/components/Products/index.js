import React, { forwardRef } from 'react';
import Product from '../Product';

export default forwardRef(({ items }, ref) => (
  <div className="products" ref={ref}>
    {items.map((item, ndx) => <Product key={ndx} {...item} />)}
  </div>
));
