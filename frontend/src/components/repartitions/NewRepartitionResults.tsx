import React from "react";
import Row from "react-bootstrap/Row";
import { RepartitionsHome } from "./Home";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextFormGroup } from "../utils/forms/TextFormGroup";
import { PageTitle } from "../utils/PageTitle";

export const NewRepartitionResults = ({ children }: { children?: any }) => {
  return (
    <RepartitionsHome>
      <PageTitle>Résultats</PageTitle>
      <Row>{children}</Row>
    </RepartitionsHome>
  );
};
