import { useState, useEffect } from "react";
import classes from "./LiveStreamVideoHeader.module.scss";
import { FaCircle } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import { FiClock } from "react-icons/fi";

import { formatDate, formatTime } from "../../../utils/helper";

const LiveStreamVideoHeader = () => {
  const [currentDateObj, setCurrentDateObj] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateObj(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  const formattedDate = formatDate(currentDateObj);
  const formattedTime = formatTime(currentDateObj);

  return (
    <div className={classes.videoHeader}>
      <div className={classes.videoIcon}>
        <FaCircle className={`${classes.dotIcon}`} />
        <p className={classes.live}>Live</p>
      </div>
      <div className={classes.dateTimeContainer}>
        {/* <div className={classes.date}>
          <FiCalendar className={classes.icon} />
          {formattedDate}
        </div> */}
        <div className={classes.time}>
          <FiClock className={classes.icon} />
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default LiveStreamVideoHeader;
