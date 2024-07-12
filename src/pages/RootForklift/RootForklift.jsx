import { useContext } from "react";
import classes from "./RootForklift.module.scss";

import Header from "../../components/Header/Header";
// import Sidebar from "../../components/Sidebar/Sidebar";
import Footer from "../../components/Footer/Footer";
import DashboardPPE from "../../components/Dashboard/DashboardForklift/DashboardForklift";
import { ZoomContext } from "../../store/ZoomContext";
const RootForklift = () => {
  const { isZoomed, toggleZoom } = useContext(ZoomContext);
  console.log(isZoomed);
  return (
    <div className={classes.container}>
      {!isZoomed && <Header />}
      <div className={classes.content}>
        {/* {!isZoomed && <Sidebar />} */}
        <DashboardPPE />
      </div>
      {<Footer />}
    </div>
  );
};

export default RootForklift;
