import { useState, useContext } from "react";
import Activities from "../../Activities/Activities.jsx";
import LiveStream from "../../LiveStream/LiveStream.jsx";
import classes from "./DashboardPPE.module.scss";
import { ZoomContext } from "../../../store/ZoomContext.jsx";
import DashboardStatsPPE from "../../DashboardStats/DashboardStatsPPE/DashboardStatsPPE.jsx";
import DonutChart from "../../Charts/DonutChart/DonutChart.jsx";
import LineChart from "../../Charts/LineChart/LineChart";

export default function DashboardPPE() {
  const { isZoomed, toggleZoom } = useContext(ZoomContext);
  console.log(isZoomed);
  return (
    <>
      <main className={classes.dashboard}>
        <div className={classes["dashboard-overview"]}>
          {!isZoomed && <DashboardStatsPPE />}
          <LiveStream
            isZoomed={isZoomed}
            handleZoomClick={toggleZoom}
            useCase="ppe"
          />
        </div>
        <Activities useCase="ppe" />
      </main>
    </>
  );
}
