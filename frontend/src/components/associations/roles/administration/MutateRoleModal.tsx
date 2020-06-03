import React from "react";
import Modal from "react-bootstrap/Modal";
import {
    PERMISSIONS,
    RolePermission,
} from "../../../../models/associations/role";
import * as Yup from "yup";
import { Form, Formik, FormikHelpers } from "formik";
import Button from "react-bootstrap/Button";
import { TextFormGroup } from "../../../utils/forms/TextFormGroup";
import { DayPickerInputFormGroup } from "../../../utils/forms/DayPickerInputFormGroup";
import { SwitchCheckbox } from "../../../utils/forms/SwitchCheckbox";
import { SelectGroup } from "../../../utils/forms/SelectGroup";
import { RolePermissionIcon } from "./RolePermissionIcon";
import { RolePermissionTooltip } from "./RolePermissionTooltip";
import "./mutate_role_modal.css";

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

export type MutateRoleModalValues = {
    role: string;
    rank: number;
    startDate: Date;
    endDate: Date | undefined | null;
    endDateEnabled: boolean;
    permissions: RolePermission[];
};

export const MutateRoleModal = ({
    title,
    show,
    initialValues,
    onSubmit,
    onHide,
}: {
    title: string;
    show: boolean;
    initialValues: MutateRoleModalValues;
    onSubmit: (
        values: MutateRoleModalValues,
        formikHelpers: FormikHelpers<MutateRoleModalValues>
    ) => void;
    onHide: () => void;
}) => {
    return (
        <Modal size="lg" show={show} onHide={onHide}>
            <Modal.Header>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            <Formik
                initialValues={initialValues}
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
                onSubmit={onSubmit}
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
