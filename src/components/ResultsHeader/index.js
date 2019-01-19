import React, { forwardRef } from 'react';
import styles from './styles';

export default forwardRef(({
  headerClass,
  headerStyles,
  placeholderStyles,
  title,
}, headerRef) => (
  <div
    className="results-header-placeholder"
    style={placeholderStyles}
  >
    <header
      className={`results-header ${styles.root} ${headerClass}`}
      ref={headerRef}
      style={headerStyles}
    >
      <div className="results-header__title title-font">{title}</div>
      <nav className="results-header__nav">
        <select className="results-header__sort">
          <option>Opt 1</option>
          <option>Opt 2</option>
          <option>Opt 3</option>
          <option>Opt 4</option>
        </select>
      </nav>
    </header>
  </div>
));
