import React, {useContext, useState} from "react";
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
import {UserAvatarCard} from "../../utils/avatar/UserAvatarCard";

export const Genealogy = () => {

    const [students, setStudents] = useState<any[]>([]);
    const [links, setLinks] = useState<any[]>([]);
    const [found, setFound] = useState(true)

    const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);

    const [getGenealogy] = useMutation(api.users.getGenealogy,
         {
            onSuccess: async (res) => {
                console.log(res);
                if (!res.linkFound){
                    sendErrorToast(`Aucun chemin trouvé`);
                    setFound(false)
                }
                else {
                    sendSuccessToast(`Lien trouvé !`);
                    setFound(true)
                }
                setLinks(res.resultLinks);
                setStudents(res.result);
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

    const renderGenealogy = () => {
        if (!found){
            return (<Col key = "Not found" >Aucun chemin trouvé</Col>);
        }
        if (students.length === 0){
            return [];
        }
        var items: any[] = [];
        items.push(<Col xs={6} lg={2} key={students[0]} className="mb-5">
                        <UserAvatarCard
                          userId={students[0]}
                          tooltip={`${students[0]}`}
                          className="h-100"
                          link={true}
                        >
                        </UserAvatarCard>
                    </Col>);
        var n = students.length;
        for (var i = 0; i < n - 1; i ++){
            items.push(<Col key = {i} >{links[i]}</Col>);
            items.push(<Col xs={6} lg={2} key={students[i+1]} className="mb-5">
                            <UserAvatarCard
                              userId={students[i+1]}
                              tooltip={`${students[i+1]}`}
                              className="h-100"
                              link={true}
                            >
                            </UserAvatarCard>
            </Col>)
        }
        return items
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
        <Row>
            <div className="content">{renderGenealogy()}</div>
        </Row>
    </Container>
  );
};
