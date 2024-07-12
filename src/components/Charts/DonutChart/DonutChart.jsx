import React, { useState, useContext, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import classes from "./DonutChart.module.scss";
import { WebSocketContext } from "../../../store/WebSocketContext";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    tooltip: {
      enabled: true,
    },
  },
};

const DonutChart = () => {
  const [high, setHigh] = useState(0);
  const [medium, setMedium] = useState(0);
  const [low, setLow] = useState(0);
  const { json } = useContext(WebSocketContext);
  useEffect(() => {
    if (json) {
      const { json: cardJson } = json;
      if(cardJson.category==='alert'){
        if (cardJson.severity_level === "high") {
          setHigh((prev) => prev + 1);
        }
        if (cardJson.severity_level === "medium") {
          setMedium((prev) => prev + 1);
        }
        if (cardJson.severity_level === "low") {
          setLow((prev) => prev + 1);
        }
      }
      
    }
  }, [json]);

  const data = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        data: [high, medium, low],
        backgroundColor: ["#ff4d55", "#faad14", "#1677ff"],
        hoverBackgroundColor: ["#ff333d", "#FFCE56", , "#36A2EB"],
      },
    ],
  };
  return (
    <div
      // style={{ width: "200px", height: "200px" }}
      className={classes.donutChart}
    >
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DonutChart;
