import React from "react";
import classes from "./ButtonCustom.module.scss";
const ButtonCustom = ({ icon, children, handleClick }) => {
  return (
    <button className={classes.btn} onClick={handleClick}>
      {icon}
      {children}
    </button>
  );
};

export default ButtonCustom;
