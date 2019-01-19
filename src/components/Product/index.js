import React from 'react';
import styles from './styles';

const emptyImg = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export default ({
  price,
  subtitle,
  title,
}) => (
  <div className={`product ${styles.root}`}>
    <img src={emptyImg} alt="Item" />
    <h4>{title}</h4>
    <h6>{subtitle}</h6>
  </div>
);
