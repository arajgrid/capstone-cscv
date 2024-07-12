import React from "react";
import classes from "./CardButton.module.scss";

import { useNavigate } from "react-router-dom";

import { Card } from "antd";

const CardButton = ({ text, to, handleClick }) => {
  const navigate = useNavigate();
  return (
    <div className={`${classes.cardContainer} `}>
      <button
        to={to}
        onClick={() => {
          handleClick();
          navigate(to);
        }}
      >
        <Card
          hoverable
          className={classes.card}
          style={{
            height: "15rem",
            width: 270,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ededeb",
            cursor: "pointer",
          }}
        >
          <p className={classes.cardText}>{text}</p>
        </Card>
      </button>
    </div>
  );
};

export default CardButton;
