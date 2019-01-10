import React from 'react';
import GridItem from '../GridItem';

export default ({ items }) => (
  <div>
    {items.map((item, ndx) => <GridItem key={ndx} {...item} />)}
  </div>
);