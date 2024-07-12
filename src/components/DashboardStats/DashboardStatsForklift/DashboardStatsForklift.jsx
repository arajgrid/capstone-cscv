import { useState, useContext, useEffect } from "react";

import StatCard from "../../StatCard/StatCard";

import {WebSocketContextForklift} from "../../../store/WebSocketContextForklift";

import classes from "./DashboardStatsForklift.module.scss";

import { FiBarChart } from "react-icons/fi";
import { FiActivity } from "react-icons/fi";
import { FiTrendingUp } from "react-icons/fi";

export default function DashboardStatsForklift() {
  const [cardValues, setCardValues] = useState({
    minimum_distance: 0,
    average_distance: 0,
    proximity_score: "",
  });
  const { json } = useContext(WebSocketContextForklift);

  useEffect(() => {
    if (json) {
      const { minimum_distance, average_distance, proximity_score } = json.json;
      setCardValues({
        minimum_distance: minimum_distance,
        average_distance: average_distance,
        proximity_score: proximity_score,
      });
    }
  }, [json]);

  return (
    <ul className={classes.stats}>
      <StatCard
        label="Minimum Distance"
        score={cardValues.minimum_distance}
        Icon={FiBarChart}
        color="yellow"
        unit = "px"
      />
      <StatCard
        label="Average Distance"
        score={cardValues.average_distance}
        Icon={FiActivity}
        color="yellow"
        unit = "px"
      />
      <StatCard
        label="Proximity Score"
        score={cardValues.proximity_score}
        Icon={FiTrendingUp}
        color="yellow"
        unit = ""
      />
    </ul>
  );
}
