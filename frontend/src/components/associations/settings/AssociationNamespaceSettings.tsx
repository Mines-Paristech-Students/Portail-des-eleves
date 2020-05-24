import React, { useContext, useState } from "react";
import {
    Card,
    Row,
    Col,
    Button,
    Modal,
    InputGroup,
    Form,
} from "react-bootstrap";
import {
    api,
    PaginatedResponse,
    useBetterQuery,
} from "../../../services/apiService";
import { Pagination } from "../../utils/Pagination";
import { Loading } from "../../utils/Loading";
import { Error } from "../../utils/Error";
import { Namespace } from "../../../models/tag";
import { Tag } from "../../utils/tags/Tag";
import { Tag as TagModel } from "../../../models/tag";
import { tablerColors } from "../../../utils/colors";
import { hashCode } from "../../../utils/hashcode";
import { queryCache, useMutation } from "react-query";
import { ToastContext, ToastLevel } from "../../utils/Toast";
import { AxiosError } from "axios";
import { Formik } from "formik";
import * as Yup from "yup";

export const AssociationNamespaceSettings = ({ association }) => {
    const newToast = useContext(ToastContext);

    const [
        selectedNamespace,
        setSelectedNamespace,
    ] = useState<Namespace | null>(null);

    const [createNamespace] = useMutation(api.namespaces.create, {
        onSuccess: (response) => {
            queryCache.refetchQueries("association.namespaces.list");
            newToast({
                message: "Namespace ajouté",
                level: ToastLevel.Success,
            });
        },
        onError: (errorAsUnknown) => {
            const error = errorAsUnknown as AxiosError;
            newToast({
                message: `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${error.message}`,
                level: ToastLevel.Error,
            });
        },
    });

    return (
        <>
            <Card>
                <Card.Header>
                    <Card.Title>Tags</Card.Title>
                </Card.Header>
            </Card>

            {selectedNamespace && (
                <NamespaceTagsModal
                    namespace={selectedNamespace}
                    closeModal={() => setSelectedNamespace(null)}
                />
            )}

            <Pagination
                apiKey={[
                    "association.namespaces.list",
                    { association: association.id },
                ]}
                apiMethod={api.namespaces.list}
                render={(namespaces, paginationControl) => (
                    <>
                        <Row>
                            {namespaces.map((namespace) => (
                                <ListNamespaceTags
                                    key={namespace.id}
                                    namespace={namespace}
                                    setSelectedNamespace={setSelectedNamespace}
                                />
                            ))}
                        </Row>
                        {paginationControl}
                    </>
                )}
            />

            <Formik
                onSubmit={(values) => {
                    createNamespace({
                        name: values.namespaceName,
                        scoped_to_model: "association",
                        scoped_to_pk: association.id,
                    });
                }}
                initialValues={{ namespaceName: "namespace" }}
                validationSchema={Yup.object({
                    namespaceName: Yup.string()
                        .required("Ce champ est requis.")
                        .min(
                            2,
                            "Un namespace doit avoir au minimum 2 caractères"
                        ),
                })}
            >
                {({ values, handleChange, errors, touched, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <InputGroup>
                            <Form.Control
                                placeholder={"Nouveau namespace"}
                                name={"namespaceName"}
                                value={values.namespaceName}
                                onChange={handleChange}
                                isInvalid={
                                    (errors.namespaceName &&
                                        touched.namespaceName) ||
                                    false
                                }
                            />
                            <InputGroup.Append>
                                <Button type={"submit"} variant={"success"}>
                                    <span className="fe fe-plus" />
                                    Ajouter le namespace
                                </Button>
                            </InputGroup.Append>
                            {errors.namespaceName && touched.namespaceName && (
                                <Form.Control.Feedback type={"invalid"}>
                                    {errors.namespaceName}
                                </Form.Control.Feedback>
                            )}
                        </InputGroup>
                    </form>
                )}
            </Formik>
        </>
    );
};

const ListNamespaceTags = ({ namespace, setSelectedNamespace }) => {
    return (
        <Col md={"4"} xs={"6"}>
            <Card>
                <Card.Body>
                    <span className={"float-right"}>
                        <Button
                            size={"sm"}
                            className={"mr-2"}
                            onClick={() => setSelectedNamespace(namespace)}
                        >
                            Détails
                        </Button>
                    </span>

                    <Card.Title>{namespace.name}</Card.Title>
                </Card.Body>
            </Card>
        </Col>
    );
};

const NamespaceTagsModal = ({ namespace, closeModal }) => {
    const newToast = useContext(ToastContext);

    const { data, status, error } = useBetterQuery<
        PaginatedResponse<TagModel[]>
    >(
        ["namespace.tags.list", { namespace: namespace.id, page_size: 1000 }],
        api.tags.list
    );

    const [mutate] = useMutation(api.namespaces.delete, {
        onSuccess: (response) => {
            queryCache.refetchQueries("association.namespaces.list");
            newToast({
                message: "Namespace supprimé",
                level: ToastLevel.Success,
            });
        },
        onError: (errorAsUnknown) => {
            const error = errorAsUnknown as AxiosError;
            newToast({
                message: `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${error.message}`,
                level: ToastLevel.Error,
            });
        },
    });

    const color = tablerColors[hashCode(namespace.name) % tablerColors.length];

    const deleteNamespace = () => {
        mutate(namespace.id).then((_) => closeModal());
    };

    return (
        <>
            {status === "loading" ? (
                <Loading />
            ) : status === "error" ? (
                <Error detail={error} />
            ) : (
                <Modal show={true} onHide={closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Tags dans {namespace.name} </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {(data?.results.length || 0) > 0 ? (
                            data?.results.map((tag) => (
                                <span key={tag.id}>
                                    <Tag color={color} tag={tag.value} />
                                </span>
                            ))
                        ) : (
                            <em className={"text-muted"}>Aucun tag</em>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>
                            Fermer
                        </Button>
                        <Button variant="danger" onClick={deleteNamespace}>
                            Supprimer
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
};
