import React, { useContext } from "react";
import { Page, PageType } from "../../../models/associations/page";
import { useFormik } from "formik";
import { Form, Button } from "react-bootstrap";
import { api, useBetterQuery } from "../../../services/apiService";
import { useParams } from "react-router";
import { ToastContext, ToastLevel } from "../../utils/Toast";
import { Loading } from "../../utils/Loading";
import { Error } from "../../utils/Error";

export const AssociationCreatePage = ({ association, ...props }) => {
    const page: Page = {
        title: "",
        text: "",
        authors: [],
        creationDate: new Date(),
        lastUpdateDate: new Date(),
        tags: [],
        association: association.id,
        pageType: PageType.Static,
    };

    return <EditPage {...props} page={page} association={association} />;
};

export const AssociationEditPage = ({ association, ...props }) => {
    const { pageId } = useParams<{ pageId: string }>();

    const { data: page, status, error } = useBetterQuery<Page>(
        ["page.get", pageId],
        api.pages.get
    );

    if (status === "loading") return <Loading />;
    else if (status === "error")
        return <Error detail={`Une erreur est apparue: ${error}`} />;
    else if (page)
        return <EditPage {...props} page={page} association={association} />;

    return null;
};

const EditPage = ({ page, association, ...props }) => {
    const { sendToast, sendSuccessToast, sendErrorToast } = useContext(
        ToastContext
    );

    const formik = useFormik({
        initialValues: page,
        onSubmit: (values) => {
            sendToast("Sauvegarde en cours", ToastLevel.Info);

            api.pages
                .save(values)
                .then((res) => {
                    sendSuccessToast("Page sauvegardée !");
                    props.history.push(
                        `/associations/${association.id}/pages/${res.id}`
                    );
                })
                .catch((err) => {
                    sendErrorToast(err.message);
                });
        },
    });

    const deletePage = () => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm("Supprimer la page ? Cette action est irréversible")) {
            api.pages
                .delete(page)
                .then(() => {
                    props.history.push(`/associations/${association.id}`);
                })
                .catch((err) => {
                    sendErrorToast(err.message);
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
