import { Flex } from "antd";
import { IoAlertCircleOutline } from "react-icons/io5";

import classes from "./ActivityForklift.module.scss";

export default function ActivityForklift({ alert }) {
  return (
    <li className={`${classes.activity}`}>
      <IoAlertCircleOutline className={classes["activity-icon"]} />
      <div className={classes["activity-description"]}>
        <div className={classes.activity_info}>
          <p className={classes.activity_heading}>Forklift Proximity Alert</p>
          <p>Proximity to forklift less than minimum distance.</p>
        </div>
        
      </div>
    </li>
  );
}
