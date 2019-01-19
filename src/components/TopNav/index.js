import React, { forwardRef } from "react";
import styles from "./styles";

export default forwardRef(({ items }, ref) => (
  <nav
    className={`top-nav ${styles.root}`}
    ref={ref}
  >
    {items.map((item, ndx) => (
      <a
        key={ndx}
        className="top-nav__link title-font"
        href={item.url}
      >
        {item.label}
      </a>
    ))}
  </nav>
));
