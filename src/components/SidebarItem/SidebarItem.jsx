import { NavLink } from "react-router-dom";
import classes from "./SidebarItem.module.scss";
import { Popover, ConfigProvider } from "antd";
function SidebarItem({ Icon, label, to, isCollapsed, content, handleClick }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgElevated: "rgb(41, 40, 39,0.9)",
          colorText: "#fff",
        },
      }}
    >
      <Popover content={content} colorBgElevated>
        <NavLink
          to={to}
          className={({ isActive }) =>
            isActive
              ? `${classes["side-nav__item"]} ${classes.active}`
              : `${classes["side-nav__item"]}`
          }
          onClick={handleClick}
        >
          <div
            className={
              isCollapsed
                ? `${classes.iconContainer} ${classes.iconBox}`
                : classes.iconBox
            }
          >
            <Icon className={classes["side-nav__icon"]} />
          </div>

          {!isCollapsed && (
            <p className={classes["side-nav__label"]}>{label}</p>
          )}
        </NavLink>
      </Popover>
    </ConfigProvider>
  );
}

export default SidebarItem;
