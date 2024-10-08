import React from 'react';
import { PopupStyles as styles } from './ComponentStyles';

// Função Popup que recebe as props
const Popup = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <button style={styles.closeButton} onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

export default Popup;
