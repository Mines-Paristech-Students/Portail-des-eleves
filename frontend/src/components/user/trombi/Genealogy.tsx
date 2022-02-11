import React, {useContext} from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { PageTitle } from "../../utils/PageTitle";
import {SelectUserField } from "../../utils/forms/SelectUserField";
import * as Yup from "yup";
import {Formik, Form} from "formik";
import { useMutation} from "react-query";
import {api} from "../../../services/apiService";
import Button from "react-bootstrap/Button";
import {ToastContext} from "../../utils/Toast";

export const Genealogy = () => {

    const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);

    const [getGenealogy] = useMutation(api.users.getGenealogy,
         {
            onSuccess: async (res) => {
                sendSuccessToast(`Lien trouvé !`);
            },
            onError: (err) => {
                sendErrorToast(`Erreur lors de la recherche : ${err}`);
            },
        });

    const handleSubmit = ({ user1, user2 }) => {
        getGenealogy({
            user1: user1,
            user2: user2,
        });
    };

  return (
    <Container className="mt-5">
      <PageTitle>Généalogie minière</PageTitle>

        <Formik
            initialValues={{ user1: undefined, user2: undefined }}
            validationSchema={Yup.object({
              user1: Yup.object().required("Ce champ est requis."),
                user2: Yup.object().required("Ce champ est requis."),
            })}
            onSubmit = {handleSubmit}
        >
          <Form>
            <Row className="mb-5">
                <Col md={3}>
                  <SelectUserField
                      name = "user1"
                      label = 'Mineur 1'
                    />
                </Col>
                <Col md={{ span: 3, offset: 6 }}>
                    <SelectUserField
                      name = "user2"
                      label = "Mineur 2"
                    />
                </Col>
            </Row>
              <Container className="mb-5 text-right">
                  <Button type="submit" variant="primary">
                    Rechercher
                  </Button>
            </Container>
          </Form>
        </Formik>
    </Container>
  );
};
