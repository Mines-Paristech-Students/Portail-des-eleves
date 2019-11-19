import React from "react";
import { Page, PageType } from "../../../models/associations/page";
import { useFormik } from "formik";
import { Form, Button } from "react-bootstrap";
import { useQuery } from "react-query";
import { api } from "../../../services/apiService";
import { useParams } from "react-router";

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
        ["page.get", {pageId}],
        api.pages.get
    );

    if (isLoading) return "Loading association...";
    if (error) return `Something went wrong: ${error.message}`;
    if (page) return <EditPage page={page} />;

    return null;
};

const EditPage = ({ page }) => {
    const formik = useFormik({
        initialValues: page,
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
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
                <Button variant="primary" type="submit">Sauvegarder</Button>
            </Form.Group>
        </form>
    );
};
