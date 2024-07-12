import { useContext } from "react";
import classes from "./RootPPE.module.scss";

import Header from "../../components/Header/Header";

// import Sidebar from "../../components/Sidebar/Sidebar";
import Footer from "../../components/Footer/Footer";
import DashboardPPE from "../../components/Dashboard/DashboardPPE/DashboardPPE";
import { ZoomContext } from "../../store/ZoomContext";
import {LoadingContext} from "../../store/LoadingContext";
import {LoadingOutlined} from "@ant-design/icons";
import {Spin} from 'antd';
import DonutChart from "../../components/Charts/DonutChart/DonutChart";
const RootPPE = () => {
  const { isZoomed, toggleZoom } = useContext(ZoomContext);
  const {isLoading} = useContext(LoadingContext);
  return (
    <div className={classes.container}>
      {!isZoomed && <Header />}
      <div className={classes.content}>
        {/* {!isZoomed && <Sidebar />} */}
        {isLoading ? <Spin
      indicator={
        <LoadingOutlined
          style={{
            fontSize: 48,
          }}
          spin
        />
      }
    />: <DashboardPPE />}
        
      </div>
      {!isZoomed && <Footer />}
    </div>
    
  );
};

export default RootPPE;
