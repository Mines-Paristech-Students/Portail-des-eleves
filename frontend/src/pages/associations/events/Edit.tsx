import React, { useContext } from "react";
import { Event } from "../../../models/associations/event";
import { useFormik } from "formik";
import { Formik } from "formik";
import { Form, Button } from "react-bootstrap";
import { useQuery } from "react-query";
import { api } from "../../../services/apiService";
import { useParams } from "react-router";
import { ToastContext, ToastLevel } from "../../../utils/Toast";
import { render } from "react-dom";

// Keep the assos
// The participants are adding themselves

export const AssociationCreateEvent = ({ association, ...props }) => {
    const event: Event = {
        association: association.id,
        name: "",
        description: "",
        participants: [],
        startsAt: new Date(),
        endsAt: new Date(),
        place: ""
    }

    return <EditEvent {...props} event={event} association={association} />;
    return <EditPage {...props} page={event} association={association} />;
};

// Modify the query
export const AssociationEditEvent = ({ association, ...props }) => {
    const { pageId } = useParams();

    const { data: page, isLoading, error } = useQuery(
        ["page.get", { pageId }],
        api.pages.get
    );

    if (isLoading) return "Chargement en cours...";
    if (error) return `Une erreur est apparue: ${error.message}`;
    if (page)
        return <EditPage {...props} page={page} association={association} />;

    return null;
};


const EditEvent = ({ event, association, ...props }) => {
    return (
        <Form>
            <Form.Group controlId="formBasicTitle">
            <Form.Label>Event title</Form.Label>
            <Form.Control type="text" placeholder="Enter Title" />
            </Form.Group>
        </Form>
    );
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
