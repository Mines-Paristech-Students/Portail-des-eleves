import React, { useContext, useState } from "react";
import { Event } from "../../../models/associations/event";
import { useFormik, Field } from "formik";
import { Form, Button, Col } from "react-bootstrap";
import { useQuery } from "react-query";
import { api } from "../../../services/apiService";
import { useParams } from "react-router";
import { ToastContext, ToastLevel } from "../../../utils/Toast";
import { render } from "react-dom";
import MomentInput from 'react-moment-input';

// Keep the assos
// The participants are adding themselves

export const AssociationCreateEvent = ({ association, ...props }) => {
    const event: Event = {
        association: association.id,
        name: "",
        description: "dddd",
        participants: [],
        startsAt: new Date(),
        endsAt: new Date(),
        place: ""
    }

    return <EditEvent {...props} event={event} association={association} />;
};

// Modify the query
export const AssociationEditEvent = ({ association, ...props }) => {
    const { eventId } = useParams();

    const { data: event, isLoading, error } = useQuery(
        ["event.get", { eventId }],
        api.events.get
    );

    if (isLoading) return "Chargement en cours...";
    if (error) return `Une erreur est apparue: ${error.message}`;
    if (event)
        return <EditEvent {...props} event={event} association={association} />;

    return null;
};


const EditEvent = ({ event, association, ...props }) => {
    const newToast = useContext(ToastContext);

    const formik = useFormik({
        initialValues: event,
        onSubmit: values => {
            newToast({
                message: "Sauvegarde en cours",
                level: ToastLevel.Success
            });
            api.events
                .save(values)
                .then(res => {
                    newToast({
                        message: "Evenement sauvegardée !",
                        level: ToastLevel.Success
                    });
                    props.history.push(
                        `/associations/${association.id}/events/${res.id}`
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

    const deleteEvent = () => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm("Supprimer l'evenement ? Cette action est irréversible")) {
            api.events
                .delete(event)
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

                <Form.Label>Nom de l'evenement</Form.Label>
                <Form.Control 
                    id="name"
                    name="name"
                    type="text"
                    className=""
                    placeholder="Titre"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                />

                <Form.Label>Dates</Form.Label>
                <Form.Row>
                    <Col>
                        <MomentInput
                            id="startsAt"
                            options={true}
                            readOnly={false}
                            icon={true}
                            enableInputClick={true}
                            onChange={value => {
                                formik.setFieldValue("startsAt", value.toDate())
                            }}
                        />
                    </Col>
                    <Col>
                        <MomentInput
                            id="endsAt"
                            options={true}
                            readOnly={false}
                            icon={true}
                            enableInputClick={true}
                            onChange={value => {
                                formik.setFieldValue("endsAt", value.toDate())
                            }}
                        />
                    </Col>
                </Form.Row>

                <Form.Label>Description</Form.Label>
                <Form.Control 
                    id="description"
                    name="description"
                    type="text"
                    placeholder="Description"
                    onChange={formik.handleChange}
                    value={formik.values.description}
                />

                <Form.Label>Localisation</Form.Label>
                <Form.Control 
                    id="place"
                    name="place"
                    type="text"
                    className=""
                    placeholder="Localisation"
                    onChange={formik.handleChange}
                    value={formik.values.place}
                />

                <Button variant="primary" type="submit">
                    Sauvegarder
                </Button>
                <Button
                    variant="danger"
                    className={"ml-3"}
                    type="button"
                    onClick={deleteEvent}
                >
                    Supprimer
                </Button>
            </Form.Group>
        </form>
    );
};
