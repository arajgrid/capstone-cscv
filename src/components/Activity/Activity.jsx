import { Flex } from "antd";
import { IoAlertCircleOutline } from "react-icons/io5";

import classes from "./Activity.module.scss";

export default function Activity({ severity, alert }) {
  const date = new Date(alert.timestamp);
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");
  const time = `${hours}:${minutes}:${seconds}`;

  return (
    <li className={`${classes.activity}`}>
      <IoAlertCircleOutline className={classes["activity-icon"]} />
      <div className={classes["activity-description"]}>
        <Flex justify="space-between">
          <p className={classes.activity_heading}>{alert.event_type}</p>
          <div className={classes.severityLabel}>
            <span
              className={`${classes.severityDot} ${classes[`${severity}`]}`}
            ></span>
            {`${severity[0].toUpperCase()}${severity.slice(1)} severity`}
          </div>
        </Flex>

        <div className={classes.activity_info}>
          <p>{time}</p>
          <p>{alert.violation_type}</p>
        </div>
      </div>
    </li>
  );
}
