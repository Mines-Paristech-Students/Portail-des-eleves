import React, { useContext } from "react";
import { ToastContext } from "../../../utils/Toast";
import { queryCache, useMutation } from "react-query";
import { api } from "../../../../services/apiService";
import { AxiosError } from "axios";
import Modal from "react-bootstrap/Modal";
import { PERMISSIONS, Role } from "../../../../models/associations/role";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import Button from "react-bootstrap/Button";
import { TextFormGroup } from "../../../utils/forms/TextFormGroup";
import { DayPickerInputFormGroup } from "../../../utils/forms/DayPickerInputFormGroup";
import { SwitchCheckbox } from "../../../utils/forms/SwitchCheckbox";
import { SelectGroup } from "../../../utils/forms/SelectGroup";
import { RolePermissionIcon } from "./RolePermissionIcon";
import { RolePermissionTooltip } from "./RolePermissionTooltip";
import "./edit_role_modal.css";

const permissionItems = new Map(
    PERMISSIONS.map((permission) => [
        permission,
        <RolePermissionTooltip permission={permission}>
            <span className="selectgroup-button selectgroup-button-icon">
                <RolePermissionIcon permission={permission} />
            </span>
        </RolePermissionTooltip>,
    ])
);

export const EditRoleModal = ({
    show,
    onHide,
    role,
}: {
    show: boolean;
    onHide: any;
    role: Role | null;
}) => {
    const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);

    const [update] = useMutation(api.roles.update, {
        onSuccess: () => {
            queryCache.refetchQueries(["roles.list"]);
            sendSuccessToast("Rôle modifié.");
        },
        onError: (errorAsUnknown) => {
            const error = errorAsUnknown as AxiosError;
            sendErrorToast(
                `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${
                    error.response
                        ? "Détails : " +
                          (error.response.status === 403
                              ? "vous n’avez pas le droit de modifier ce sondage."
                              : error.response.data.detail)
                        : ""
                }`
            );
        },
    });

    if (role === null) {
        return null;
    }

    return (
        <Modal size="lg" show={show} onHide={onHide}>
            <Modal.Header>
                <Modal.Title>
                    Modifier le rôle de {role.user.firstName}{" "}
                    {role.user.lastName}
                </Modal.Title>
            </Modal.Header>

            <Formik
                initialValues={{
                    role: role.role,
                    rank: role.rank,
                    startDate: role.startDate,
                    endDate: role.endDate ? role.endDate : undefined,
                    endDateEnabled: !!role.endDate,
                    permissions: role.permissions,
                }}
                validationSchema={Yup.object({
                    role: Yup.string().required("Ce champ est requis."),
                    rank: Yup.number()
                        .required("Ce champ est requis.")
                        .min(0, "Veuillez entrer un nombre positif"),
                    startDate: Yup.date().required(
                        "Veuillez entrer une date au format JJ/MM/YYYY."
                    ),
                    endDate: Yup.date().when(
                        ["endDateEnabled", "startDate"],
                        (endDateEnabled, startDate, schema) =>
                            endDateEnabled
                                ? startDate &&
                                  schema
                                      .required(
                                          "Veuillez entrer une date au format JJ/MM/YYYY."
                                      )
                                      .min(
                                          startDate,
                                          "La date de fin doit être après la date de début."
                                      )
                                : schema.notRequired()
                    ),
                })}
                onSubmit={(values, { setSubmitting }) => {
                    update(
                        {
                            roleId: role.id,
                            role: {
                                role: values.role,
                                rank: values.rank,
                                startDate: values.startDate,
                                endDate: values.endDateEnabled
                                    ? values.endDate
                                    : null,
                                permissions: values.permissions,
                            },
                        },
                        {
                            onSettled: () => {
                                setSubmitting(false);
                                onHide();
                            },
                        }
                    );
                }}
                component={({ values }) => (
                    <Form>
                        <Modal.Body>
                            <TextFormGroup name="role" label="Rôle" />
                            <TextFormGroup
                                name="rank"
                                type="number"
                                min={0}
                                label="Position dans la liste des membres"
                                help="À positions égales, l’ordre alphabétique est utilisé."
                            />
                            <DayPickerInputFormGroup
                                name="startDate"
                                label="Date de début"
                            />
                            <DayPickerInputFormGroup
                                name="endDate"
                                label={
                                    <>
                                        <SwitchCheckbox
                                            name="endDateEnabled"
                                            labelClassName=""
                                        />
                                        Date de fin
                                    </>
                                }
                                help="Si une date de fin est donnée, les permissions du membre seront automatiquement désactivées après celle-ci."
                                disabled={!values.endDateEnabled}
                            />
                            <SelectGroup
                                name="permissions"
                                type="pills"
                                inputType="checkbox"
                                label="Permissions"
                                items={permissionItems}
                            />
                        </Modal.Body>

                        <Modal.Footer>
                            <Button
                                className="btn-icon"
                                variant="outline-danger"
                                onClick={onHide}
                            >
                                Annuler
                            </Button>
                            <Button
                                className="btn-icon"
                                variant="outline-success"
                                type="submit"
                            >
                                Valider
                            </Button>
                        </Modal.Footer>
                    </Form>
                )}
            />
        </Modal>
    );
};
