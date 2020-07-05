import React, { useContext } from "react";
import Row from "react-bootstrap/Row";
import { RepartitionsHome } from "./Home";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextFormGroup } from "../utils/forms/TextFormGroup";
import { PageTitle } from "../utils/PageTitle";
import { api } from "../../services/apiService";
import { queryCache, useMutation } from "react-query";
import { AxiosError } from "axios";
import { UserContext } from "../../services/authService";

const [
  repartitionTitlePlaceholder,
  groupsNumberPlaceholder,
  studentsNumberPlaceholder,
] = ["The Répartition", "2", "12"];


export const NewRepartition = ({ children }: { children?: any }) => {

  // const user = useContext(UserContext);
  const onSubmit = (values, { resetForm, setSubmitting }) => {
  window.open("./Groups");
    let data = {
    id: Math.random(),
    name: values.repartitionTitle,
    status: "OPEN",
   //   manager: user,
    groupsNumber: values.groupsNumber,
    studentsNumber: values.studentsNumber,
    };

    create(
      { data },
      {
        onSuccess: resetForm,
        onSettled: () => setSubmitting(false),
      }
    );
  };
  const [create] = useMutation(api.campaigns.create, {
    onSuccess: () => {
      queryCache.refetchQueries(["campaigns.list"]);
    },
    onError: (errorAsUnknown) => {
      const error = errorAsUnknown as AxiosError;
    },
  });
  return (
    <RepartitionsHome>
      <PageTitle>Nouvelle répartition</PageTitle>
      <Row>
        <Card className="text-left">
          <Formik
            initialValues={{
              repartitionTitle: "",
              groupsNumber: "",
              studentsNumber: "",
            }}
            validationSchema={Yup.object({
              repartitionTitle: Yup.string().required("Ce champ est requis."),
              groupsNumber: Yup.string()
                .max(2)
                .required("Ce champ est requis."),
              studentsNumber: Yup.string()
                .max(3)
                .required("Ce champ est requis."),
            })}
            onSubmit={onSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit}>
                <Card.Body>
                  <TextFormGroup
                    label="Sujet"
                    name="repartitionTitle"
                    type="text"
                    placeholder={repartitionTitlePlaceholder}
                  />
                  <TextFormGroup
                    label="Nombre de groupes"
                    name="groupsNumber"
                    type="number"
                    placeholder={groupsNumberPlaceholder}
                  />
                  <TextFormGroup
                    label="Nombre d'élèves"
                    name="studentsNumber"
                    type="number"
                    placeholder={studentsNumberPlaceholder}
                  />
                </Card.Body>
                <Card.Footer className="text-right">
                  <Button type="submit" variant="outline-success">
                    Créer
                  </Button>
                </Card.Footer>
              </form>
            )}
          </Formik>
        </Card>
      </Row>
    </RepartitionsHome>
  );
};
