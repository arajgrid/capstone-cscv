import React, { useContext } from "react";
import InputField from "../../components/ui/InputField/InputField";
import Button from "../../components/ui/ButtonLogin/ButtonLogin";
import GoogleSignInButton from "../../components/ui/GoogleSignInButton/GoogleSignInButton";
import classes from "./LoginForm.module.scss";
import Header from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";

import { isEmail, hasMinLength, isNotEmpty } from "../../utils/validation";
import useInput from "../../hooks/useInput";
import { AuthContext } from "../../store/AuthContext";

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    value: emailValue,
    handleInputChange: handleEmailChange,
    handleInputBlur: handleEmailBlur,
    hasError: emailHasError,
  } = useInput("", (value) => isEmail(value) && isNotEmpty(value));

  const {
    value: passwordValue,
    handleInputChange: handlePasswordChange,
    handleInputBlur: handlePasswordBlur,
    hasError: passwordHasError,
  } = useInput("", (value) => hasMinLength(value, 6));

  function handleSubmit(e) {
    e.preventDefault();
    const userData = { emailValue };
    login(userData);
    navigate("/select-useCase");
  }

  const handleLogin = () => {
  };

  const handleGoogleSignIn = () => {};

  return (
    <div className={classes.container}>
      <Header />
      <form className={classes.loginForm} onSubmit={handleSubmit}>
        <h1 className={classes.heading}>Welcome to Incident Management</h1>
        <p className={classes.para}>
          Please log in to your account to start using the application
        </p>
        <InputField
          type="email"
          name="email"
          onBlur={handleEmailBlur}
          value={emailValue}
          onChange={handleEmailChange}
          error={emailHasError && "Please enter valid email"}
          placeholder="Email"
        />
        <InputField
          type="password"
          name="password"
          onBlur={handlePasswordBlur}
          value={passwordValue}
          onChange={handlePasswordChange}
          // error={passwordHasError && "Please enter valid password(Length>6)"}
          placeholder="Password"
        />
        <Button onClick={handleLogin} type="submit">
          CONTINUE
        </Button>

        {/* <div className={classes.orDivider}>
          <hr />
          <span>OR</span>
          <hr />
        </div> */}
        {/* <GoogleSignInButton onClick={handleGoogleSignIn} /> */}
      </form>
      <p className={classes.footer}>Terms of Service | Privacy Policy</p>
    </div>
  );
};

export default LoginForm;
