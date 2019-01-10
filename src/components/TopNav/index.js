import React from "react";
import styles from "./styles";

export default ({ items }) => (
  <nav className={`top-nav ${styles.root}`}>
    {items.map((item, ndx) => (
      <a key={ndx} href={item.url}>
        {item.label}
      </a>
    ))}
  </nav>
);
