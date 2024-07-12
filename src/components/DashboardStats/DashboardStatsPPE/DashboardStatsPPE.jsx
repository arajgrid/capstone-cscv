import { useState, useContext, useEffect } from "react";

import StatCard from "../../StatCard/StatCard";

import { WebSocketContext } from "../../../store/WebSocketContext";

import classes from "./DashboardStatsPPE.module.scss";

import { FiBarChart } from "react-icons/fi";
import { FiActivity } from "react-icons/fi";
import { FiTrendingUp } from "react-icons/fi";

import { Progress } from "antd";
import { Gauge } from "@mui/x-charts/Gauge";

export default function DashboardStatsPPE() {
  const [cardValues, setCardValues] = useState({
    total_violation: 0,
    safety_score: 0,
    safety_conditions: "",
  });
  const { json } = useContext(WebSocketContext);

  useEffect(() => {
    if (json) {
      const { total_violation, safety_score, safety_conditions } = json.json;
      setCardValues({
        total_violation: total_violation,
        safety_score: safety_score,
        safety_conditions: safety_conditions,
      });
    }
  }, [json]);

  return (
    <ul className={classes.stats}>
      <StatCard
        label="Total Violations"
        score={cardValues.total_violation}
        Icon={FiBarChart}
        color="yellow"
        unit=""
        Progress={undefined}
      />
      <StatCard
        label="Safety Score"
        score={cardValues.safety_score}
        Icon={FiActivity}
        color="yellow"
        unit="%"
        // Progress={Progress}
        Progress={Gauge}
      />
      <StatCard
        label="Safety Conditions"
        score={cardValues.safety_conditions}
        Icon={FiTrendingUp}
        color="yellow"
        unit=""
        Progress={undefined}
      />
      {/* <StatCard label="Incident frequency" score={56} Icon={FiTrendingUp} /> */}
    </ul>
  );
}
