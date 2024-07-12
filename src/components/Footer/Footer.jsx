import GDlogo from "../../assets/icons/GDlogo.svg";
import classes from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.footer__logo}>
        <img
          src={GDlogo}
          alt="Grid Dynamics Logo"
          className={classes["footer__logo-icon"]}
        />
        <span className={classes.footer__title}>Grid Dynamics</span>
      </div>
      <div className={classes.footer__info}>
        <button className={classes["footer__help-button"]}>
          <span className={classes["footer__info-help"]}>Help & feedback</span>
        </button>
        <span className={classes["footer__info-divider"]}>|</span>
        <span className={classes["footer__info-item"]}>
          &copy; Grid Dynamics 2024
        </span>
      </div>
    </footer>
  );
};

export default Footer;
