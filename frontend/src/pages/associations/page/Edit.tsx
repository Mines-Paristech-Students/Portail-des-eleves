import React, { useContext } from "react";
import { Page, PageType } from "../../../models/associations/page";
import { useFormik } from "formik";
import { Form, Button } from "react-bootstrap";
import { useQuery } from "react-query";
import { api } from "../../../services/apiService";
import { useParams } from "react-router";
import { ToastContext, ToastLevel } from "../../../utils/Toast";

export const AssociationCreatePage = ({ association, ...props }) => {
    const page: Page = {
        title: "",
        text: "",
        authors: [],
        creationDate: new Date(),
        lastUpdateDate: new Date(),
        tags: [],
        association: association.id,
        pageType: PageType.Static
    };

    return <EditPage {...props} page={page} association={association} />;
};

export const AssociationEditPage = ({ association, ...props }) => {
    const { pageId } = useParams();

    const { data: page, isLoading, error } = useQuery(
        ["page.get", { pageId }],
        api.pages.get
    );

    if (isLoading) return "Loading association...";
    if (error) return `Something went wrong: ${error.message}`;
    if (page)
        return <EditPage {...props} page={page} association={association} />;

    return null;
};

const EditPage = ({ page, association, ...props }) => {
    const newToast = useContext(ToastContext);

    const formik = useFormik({
        initialValues: page,
        onSubmit: values => {
            newToast({
                message: "Sauvegarde en cours",
                level: ToastLevel.Success
            });
            api.pages
                .save(values)
                .then(res => {
                    newToast({
                        message: "Page sauvegardée !",
                        level: ToastLevel.Success
                    });
                    props.history.push(
                        `/associations/${association.id}/pages/${res.id}`
                    );
                })
                .catch(err => {
                    newToast({
                        message: err.message,
                        level: ToastLevel.Error
                    });
                });
        }
    });

    const deletePage = () => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm("Supprimer la page ? Cette action est irréversible")) {
            api.pages
                .delete(page)
                .then(res => {
                    props.history.push(`/associations/${association.id}`);
                })
                .catch(err => {
                    newToast({
                        message: err.message,
                        level: ToastLevel.Error
                    });
                });
        }
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <Form.Group className="mt-6">
                <Form.Control
                    id="title"
                    name="title"
                    type="text"
                    className="my-2 form-control-lg"
                    placeholder="Titre"
                    onChange={formik.handleChange}
                    value={formik.values.title}
                />
                <Form.Control
                    as="textarea"
                    id="text"
                    name="text"
                    className="my-2"
                    placeholder="Contenu"
                    onChange={formik.handleChange}
                    value={formik.values.text}
                    rows={10}
                />
                <Button variant="primary" type="submit">
                    Sauvegarder
                </Button>
                <Button
                    variant="danger"
                    className={"ml-3"}
                    type="button"
                    onClick={deletePage}
                >
                    Supprimer
                </Button>
            </Form.Group>
        </form>
    );
};
