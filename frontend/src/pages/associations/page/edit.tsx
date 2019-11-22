import React, { useContext} from "react";
import { Page, PageType } from "../../../models/associations/page";
import { useFormik } from "formik";
import { Form, Button } from "react-bootstrap";
import { useQuery } from "react-query";
import { api } from "../../../services/apiService";
import { useParams } from "react-router";
import { ToastContext, ToastLevel } from "../../../utils/Toast";

export const AssociationCreatePage = ({ association }) => {
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

    return <EditPage page={page} />;
};

export const AssociationEditPage = ({ association }) => {
    const { pageId } = useParams();

    const { data: page, isLoading, error } = useQuery(
        ["page.get", { pageId }],
        api.pages.get
    );

    if (isLoading) return "Loading association...";
    if (error) return `Something went wrong: ${error.message}`;
    if (page) return <EditPage page={page} />;

    return null;
};

const EditPage = ({ page }) => {
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
                .then(() => {
                    newToast({
                        message: "Page sauvegardée !",
                        level: ToastLevel.Error
                    });
                })
                .catch(err => {
                    newToast({
                        message: err.message,
                        level: ToastLevel.Error
                    });
                });
        }
    });
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
            </Form.Group>
        </form>
    );
};
