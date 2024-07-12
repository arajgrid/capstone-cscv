import SidebarItem from "../SidebarItem/SidebarItem";
import ButtonCustom from "../ui/Button/ButtonCustom";
// import homeIcon from "../../assets/icons/home.svg";
import { FiHome } from "react-icons/fi";
import { FiCamera } from "react-icons/fi";
import { GoSidebarCollapse } from "react-icons/go";
import { GoSidebarExpand } from "react-icons/go";
import { LuForklift } from "react-icons/lu";

import classes from "./Sidebar.module.scss";
import { useState } from "react";

import { handlePpeClick, handleForkliftClick } from "../../utils/http";

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const contentPPE = (
    <div>
      <p>PPE</p>
    </div>
  );
  const contentForklift = (
    <div>
      <p>Forklift</p>
    </div>
  );

  function handleSidebarIconClick() {
    setIsSidebarOpen((prevState) => !prevState);
  }
  return (
    <nav
      className={`${classes.sidebar} ${
        isSidebarOpen ? classes.open : classes.collapsed
      }`}
    >
      <ul className={classes["side-nav"]}>
        <div
          className={
            isSidebarOpen
              ? classes.sidebarHeader__open
              : classes.sidebarHeader__close
          }
        >
          <ButtonCustom
            icon={
              isSidebarOpen ? (
                <GoSidebarExpand className={classes.expandIcon} />
              ) : (
                <GoSidebarCollapse className={classes.expandIcon} />
              )
            }
            handleClick={handleSidebarIconClick}
          ></ButtonCustom>
          {isSidebarOpen && (
            <p className={classes["sidebarHeader__title"]}>Sidebar</p>
          )}
        </div>
        <SidebarItem
          to="/dashboard-ppe"
          Icon={FiHome}
          label="Dashboard PPE"
          isCollapsed={!isSidebarOpen}
          content={contentPPE}
          handleClick={handlePpeClick}
        />
        <SidebarItem
          to="/dashboard-forklift"
          Icon={LuForklift}
          label="Dashboard Forklift"
          isCollapsed={!isSidebarOpen}
          content={contentForklift}
          handleClick={handleForkliftClick}
        />
      </ul>
    </nav>
  );
}

export default Sidebar;
