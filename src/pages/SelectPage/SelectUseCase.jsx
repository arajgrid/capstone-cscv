import React from "react";
import classes from "./SelectUseCase.module.scss";
import CardButton from "./CardButton/CardButton";
import { handlePpeClick, handleForkliftClick } from "../../utils/http";

const SelectUseCase = () => {
  return (
    <div className={`${classes.container} ${classes.blurBackground}`}>
      {/* <h1>Select Use Case</h1> */}
      <div className={classes.cardContainer}>
        <CardButton
          text="Personal Protective Equipment (PPE) Usage"
          to="/dashboard-ppe"
          handleClick={handlePpeClick}
        />
        <CardButton
          text="Forklift Management"
          to="/dashboard-forklift"
          handleClick={handleForkliftClick}
        />
      </div>
    </div>
  );
};

export default SelectUseCase;
