import { useState } from "react";
import { Drawer } from "antd";
import classes from "./Drawer.module.scss";

const DrawerProvider = ({ title, children, onClose, open }) => {
  return (
    <Drawer
      title={title}
      onClose={onClose}
      open={open}
      className={classes.drawer}
    >
      {children}
    </Drawer>
  );
};

export default DrawerProvider;
