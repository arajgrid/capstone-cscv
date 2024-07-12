import React from "react";
import classes from "./InputField.module.scss";

const InputField = ({ type, placeholder, error, ...props }) => {
  return (
    <div className={classes.inputField}>
      <input type={type} placeholder={placeholder} {...props} />
      {error && <p className={classes["control-error-para"]}>{error}</p>}
    </div>
  );
};

export default InputField;
