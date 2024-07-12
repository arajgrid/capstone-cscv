import React from "react";
import styles from "./ButtonLogin.module.scss";

const ButtonLogin = ({ children, onClick }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
};

export default ButtonLogin;
