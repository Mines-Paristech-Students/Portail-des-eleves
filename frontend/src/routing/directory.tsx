import { Route } from "./global";
import { DirectoryDoctors } from "../components/directory/doctors/DirectoryDoctors";
import { Redirect } from "react-router";
import React from "react";
import { DirectoryDoctorsDetail } from "../components/directory/doctors/DirectoryDoctorsDetail";

export const routes: Route[] = [
  {
    path: "",
    component: () => <Redirect to="/annuaire/medecins" />,
    exact: true,
  },
  {
    path: "/medecins",
    component: DirectoryDoctors,
    exact: true,
  },
  {
    path: `/medecins/:doctorId`,
    component: DirectoryDoctorsDetail,
    exact: true,
  },
];
