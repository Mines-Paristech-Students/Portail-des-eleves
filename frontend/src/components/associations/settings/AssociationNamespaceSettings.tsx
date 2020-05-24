import React, { useContext } from "react";
import { Card, Button, InputGroup, Form } from "react-bootstrap";
import {
    api,
    PaginatedResponse,
    useBetterQuery,
} from "../../../services/apiService";
import { Pagination } from "../../utils/Pagination";
import { Loading } from "../../utils/Loading";
import { Error } from "../../utils/Error";
import { Tag } from "../../utils/tags/Tag";
import { Tag as TagModel } from "../../../models/tag";
import { tablerColors } from "../../../utils/colors";
import { hashCode } from "../../../utils/hashcode";
import { queryCache, useMutation } from "react-query";
import { ToastContext, ToastLevel } from "../../utils/Toast";
import { AxiosError } from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import { Table } from "../../utils/table/Table";

export const AssociationNamespaceSettings = ({ association }) => {
    return (
        <>
            <Card>
                <Card.Header>
                    <Card.Title>Tags</Card.Title>
                </Card.Header>
                <Card.Body>
                    <CreateNamespaceForm association={association} />
                </Card.Body>
                <Pagination
                    apiKey={[
                        "association.namespaces.list",
                        { association: association.id },
                    ]}
                    apiMethod={api.namespaces.list}
                    paginationControlProps={{
                        className: "justify-content-center mt-5",
                    }}
                    render={(namespaces, paginationControl) => (
                        <div className={"mt-3"}>
                            <Table
                                columns={columns}
                                data={namespaces}
                                showHeaders={false}
                            />
                            {paginationControl}
                        </div>
                    )}
                />
            </Card>
        </>
    );
};

const columns = [
    {
        key: "name",
        header: "Nom",
    },
    {
        key: "tags",
        header: "Tags",
        render: (namespace) => <TagList namespace={namespace} />,
    },
    {
        key: "actions",
        header: "",
        render: (namespace) => <NamespaceDeleteButton namespace={namespace} />,
        headerClassName: "text-right",
        cellClassName: "text-right",
    },
];

const TagList = ({ namespace }) => {
    const { data, status, error } = useBetterQuery<
        PaginatedResponse<TagModel[]>
    >(
        ["namespace.tags.list", { namespace: namespace.id, page_size: 1000 }],
        api.tags.list
    );

    const color = tablerColors[hashCode(namespace.name) % tablerColors.length];

    return (
        <>
            {status === "loading" ? (
                <Loading />
            ) : status === "error" ? (
                <Error detail={error} />
            ) : (data?.results.length || 0) > 0 ? (
                data?.results.map((tag) => (
                    <span key={tag.id}>
                        <Tag color={color} tag={tag.value} />
                    </span>
                ))
            ) : (
                <em className={"text-muted"}>Aucun tag</em>
            )}
        </>
    );
};

const NamespaceDeleteButton = ({ namespace }) => {
    const newToast = useContext(ToastContext);

    const [mutate] = useMutation(api.namespaces.delete, {
        onSuccess: (response) => {
            queryCache.refetchQueries(["association.namespaces.list"]);
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

    return (
        <span
            className={"fe fe-x text-danger"}
            onClick={() =>
                window.confirm("Supprimer le namespace ?") &&
                mutate(namespace.id)
            }
        />
    );
};

const CreateNamespaceForm = ({ association }) => {
    const newToast = useContext(ToastContext);

    const [createNamespace] = useMutation(api.namespaces.create, {
        onSuccess: (response) => {
            queryCache.refetchQueries(["association.namespaces.list"]);
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
        <Formik
            onSubmit={(values) => {
                createNamespace({
                    name: values.namespaceName,
                    scoped_to_model: "association",
                    scoped_to_pk: association.id,
                });
            }}
            initialValues={{ namespaceName: "" }}
            validationSchema={Yup.object({
                namespaceName: Yup.string()
                    .required("Ce champ est requis.")
                    .min(2, "Un namespace doit avoir au minimum 2 caractères"),
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
    );
};
