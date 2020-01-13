import React from 'react';
import styles from './style.css';

export default function() {
  return (
    <div>
      <p id="css-inclusion" className={styles['css-modules-inclusion']}>
        CSS Modules are working!
      </p>
    </div>
  );
}
