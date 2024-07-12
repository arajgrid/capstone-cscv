import logo from "../../assets/icons/logo.svg";
import classes from "./Header.module.scss";
import { Link, useNavigate } from "react-router-dom";

import { IoMdArrowDropdown } from "react-icons/io";

import { Dropdown, Space, ConfigProvider, Button, Modal } from "antd";

import { AuthContext } from "../../store/AuthContext";
import { useContext, useState } from "react";
import { extractUsername } from "../../utils/helper";
function Header() {
  const { user, logout } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    logout();

    setIsModalOpen(false);
    navigate("/");
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // function handleLogoutClick() {
  //   logout();
  //   navigate("/");
  // }
  console.log(user);
  const items = [
    {
      label: (
        <a onClick={showModal} className={classes.logOutBtn}>
          <p>Log out</p>
        </a>
      ),
      key: "0",
    },
  ];
  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Modal: {
              titleLineHeight: "2rem",
            },
          },
          token: {
            fontSizeHeading5: "2rem",
            fontWeightStrong: 400,
            paddingLG: "25rem",
          },
        }}
      >
        <Modal
          title="Are You Sure you want to log out?"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        ></Modal>
      </ConfigProvider>

      <header className={classes.header}>
        <div className={classes.header__logo}>
          <img src={logo} alt="Logo" className={classes["header__logo-icon"]} />
          <span className={classes.header__title}>Incident Management</span>
        </div>

        {user && user.emailValue !== "" ? (
          <div className={classes.header__profile}>
            <div className={classes["header__profile-icon"]}>YS</div>

            <div className={classes["header__profile-name"]}>
              {user && user.emailValue !== ""
                ? extractUsername(user.emailValue)
                : "Jacqueline Salazarera"}
            </div>
            <ConfigProvider
              theme={{
                components: {
                  Dropdown: {
                    /* here is your component tokens */
                    paddingBlock: "1rem",
                  },
                },
              }}
            >
              <Dropdown
                menu={{
                  items,
                }}
                trigger={["click"]}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <IoMdArrowDropdown className={classes.dropdownIcon} />
                  </Space>
                </a>
              </Dropdown>
            </ConfigProvider>
          </div>
        ) : undefined}
      </header>
    </>
  );
}

export default Header;
