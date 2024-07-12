import React, { useState,useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LoadingContext} from "../../../store/LoadingContext";
import classes from "./CameraButton.module.scss";

const CameraButton = ({ Icon, children, onClick, to }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {isLoading,setIsLoading} = useContext(LoadingContext);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        setIsLoading(true);
        onClick();
        setIsLoading(false);
        navigate(to);
      }}
      className={
        location.pathname === to
          ? `${classes.cameraButton} ${classes.active}`
          : classes.cameraButton
      }
    >
      <Icon className={classes.cameraIcon} />
      {children}
    </button>
  );
};

export default CameraButton;
