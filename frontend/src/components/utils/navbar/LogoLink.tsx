import React from "react";
import Logo from "../../../logo-mines.png";
import { Link } from "react-router-dom";

export const LogoLink = () => (
  <Link to="/" className="header-brand">
    <img src={Logo} width="140" alt="Mines Paris - PSL" />
  </Link>
);
