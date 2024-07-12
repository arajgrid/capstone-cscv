import { useState } from "react";
import { ImStatsDots } from "react-icons/im";
import { GiChart } from "react-icons/gi";

import { FaChartColumn } from "react-icons/fa6";
import { BarChartOutlined } from "@ant-design/icons";
import { Button, Flex, Tooltip, ConfigProvider } from "antd";
import { MdFullscreen } from "react-icons/md";
import { MdFullscreenExit } from "react-icons/md";

import ButtonCustom from "../../ui/ButtonCustom/ButtonCustom";
import classes from "./LiveStreamVideoFooter.module.scss";
import DrawerProvider from "./Drawer/Drawer";
import DonutChart from "../../Charts/DonutChart/DonutChart";

const LiveStreamVideoFooter = ({ isZoomed, handleZoomClick, useCase }) => {
  const [open, setOpen] = useState({
    ppe: false,
    forklift: false,
  });
  const showDrawer = (clickedDrawer) => {
    setOpen((prev) => {
      return {
        ...prev,
        [clickedDrawer]: true,
      };
    });
  };
  const onClose = (clickedDrawer) => {
    setOpen((prev) => {
      return {
        ...prev,
        [clickedDrawer]: false,
      };
    });
  };
  return (
    <div className={classes.footer}>
      <Flex wrap>
        {/* <ConfigProvider
          theme={{
            components: {
              Button: {
                defaultActiveBorderColor: "none",
                defaultHoverBg: "transparent",
                defaultHoverColor: "#4096ff",
                defaultActiveBg: "none",
                defaultActiveColor: "#fff",
              },
            },
          }}
        >
          <Tooltip title="Analytics">
            <Button
              type="text"
              icon={
                <GiChart className={classes.analyticsIcon} strokeWidth={30} />
              }
              className={classes.analyticsButton}
              size="large"
              onClick={() => {
                showDrawer(useCase);
              }}
            />
          </Tooltip>
        </ConfigProvider> */}
        <ConfigProvider
          theme={{
            components: {
              Button: {
                /* here is your component tokens */
                defaultActiveBorderColor: "none",
                defaultHoverBg: "transparent",
                defaultHoverColor: "#4096ff",
                defaultActiveBg: "none",
                defaultActiveColor: "#fff",
              },
            },
          }}
        >
          <Tooltip title="Zoom">
            <Button
              type="text"
              icon={
                isZoomed ? (
                  <MdFullscreenExit className={classes.zoomIcon} />
                ) : (
                  <MdFullscreen className={classes.zoomIcon} />
                )
              }
              className={classes.analyticsButton}
              size="large"
              onClick={handleZoomClick}
            />
          </Tooltip>
        </ConfigProvider>
      </Flex>
      <DrawerProvider
        title="PPE Statistics"
        onClose={() => {
          onClose(useCase);
        }}
        open={open.ppe}
      >
        <div className={classes.charts}>
          <p className={classes.chart}>
            <h2 className={classes.chartsHeading}>Severity Levels</h2>
            <DonutChart />
          </p>
        </div>
      </DrawerProvider>
      <DrawerProvider
        title="Forklift Statistics"
        onClose={() => {
          onClose(useCase);
        }}
        open={open.forklift}
      ></DrawerProvider>
    </div>
  );
};

export default LiveStreamVideoFooter;
