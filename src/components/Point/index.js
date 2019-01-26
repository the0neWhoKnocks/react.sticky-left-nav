import React from 'react';
import styles from './styles';

export default ({
  className,
  type,
}) => (
  <div
    className={`point ${styles.root} ${className}`}
    data-point-type={type}
  />
);
