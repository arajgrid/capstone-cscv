import { useState, useContext } from "react";
import Activities from "../../Activities/Activities.jsx";
import LiveStream from "../../LiveStream/LiveStream.jsx";
import classes from "./DashboardForklift.module.scss";
import { ZoomContext } from "../../../store/ZoomContext.jsx";
import DashboardStatsForklift from "../../DashboardStats/DashboardStatsForklift/DashboardStatsForklift.jsx";

export default function DashboardForklift() {
  const { isZoomed, toggleZoom } = useContext(ZoomContext);
  console.log(isZoomed);
  return (
    <>
      <main className={classes.dashboard}>
        <div className={classes["dashboard-overview"]}>
          {!isZoomed && <DashboardStatsForklift />}
          <LiveStream isZoomed={isZoomed} handleZoomClick={toggleZoom} useCase = "forklift"/>
        </div>
        <Activities useCase = "forklift"/>
      </main>
    </>
  );
}
