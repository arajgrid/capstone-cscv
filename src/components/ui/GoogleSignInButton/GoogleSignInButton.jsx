import React from "react";
import classes from "./GoogleSignInButton.module.scss";
import { FcGoogle } from "react-icons/fc";

const GoogleSignInButton = ({ onClick }) => {
  return (
    <button className={classes.googleSignInButton} onClick={onClick}>
      <FcGoogle className={classes.googleLogo} />
      Sign in with Google
    </button>
  );
};

export default GoogleSignInButton;
