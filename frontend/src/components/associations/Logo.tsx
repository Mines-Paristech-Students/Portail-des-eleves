import { api, useBetterQuery } from "../../services/apiService";
import { Media } from "../../models/associations/media";
import React from "react";

/**
 * Logos url are not shipped by default for associations for performances,
 * so instead of directly use an <img /> tag, use a <Logo /> one
 * @param association the association for which we want the logo
 * @param props additionnal JSX props
 */
export const Logo = ({ association, ...props }) => {
  const { data: logo, status } = useBetterQuery<Media>(
    ["association.logo.get", association.logo],
    api.medias.get
  );

  return status === "error" ? (
    <p className="text-danger" {...props}>
      Erreur lors du chagement
    </p>
  ) : status === "success" && logo ? (
    <img src={logo.url} alt="Logo de l'association" {...props} />
  ) : null;
};
