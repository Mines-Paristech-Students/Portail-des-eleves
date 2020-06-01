import React, { useState, useContext } from "react";
import { Table, useColumns } from "../../../utils/table/Table";
import { Role } from "../../../../models/associations/role";
import { Pagination } from "../../../utils/Pagination";
import { api } from "../../../../services/apiService";
import { Association } from "../../../../models/associations/association";
import dayjs from "dayjs";
import Container from "react-bootstrap/Container";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { PageTitle } from "../../../utils/PageTitle";
import Card from "react-bootstrap/Card";
import { sortingToApiParameter } from "../../../utils/table/sorting";
import Button from "react-bootstrap/Button";
import { ToastContext } from "../../../utils/Toast";
import { queryCache, useMutation } from "react-query";
import { ForbiddenError } from "../../../utils/ErrorPage";
import { EditRoleModal } from "./EditRoleModal";
import { RolePermissionIconTooltip } from "./RolePermissionIconTooltip";

const EditRoleButton = ({ handleClick }: { handleClick: () => void }) => (
    <OverlayTrigger
        placement="bottom"
        delay={{ show: 200, hide: 0 }}
        overlay={<Tooltip id="edit-button-tooltip">Modifier</Tooltip>}
    >
        <Button
            className="btn-icon m-1"
            variant="outline-primary"
            size="sm"
            onClick={handleClick}
        >
            <i className="fe fe-edit" />
        </Button>
    </OverlayTrigger>
);

const DeleteRoleButton = ({ handleClick }: { handleClick: () => void }) => (
    <OverlayTrigger
        placement="bottom"
        delay={{ show: 200, hide: 0 }}
        overlay={<Tooltip id="delete-button-tooltip">Supprimer</Tooltip>}
    >
        <Button
            className="btn-icon m-1"
            variant="outline-danger"
            size="sm"
            onClick={handleClick}
        >
            <i className="fe fe-trash-2" />
        </Button>
    </OverlayTrigger>
);

const columnData = (
    setEditRole: (role: Role) => void,
    remove: (roleId: number) => void
) => [
    {
        key: "member",
        header: "Membre",
        render: (role: Role) =>
            [role.user.firstName, role.user.lastName].join(" "),
        canSort: true,
    },
    {
        key: "role",
        header: "Rôle",
        canSort: true,
    },
    {
        key: "startDate",
        header: "Début",
        render: (role: Role) => dayjs(role.startDate).format("DD/MM/YYYY"),
        canSort: true,
    },
    {
        key: "endDate",
        header: "Fin",
        render: (role: Role) =>
            role.endDate ? dayjs(role.endDate).format("DD/MM/YYYY") : "",
        canSort: true,
    },
    {
        key: "permissions",
        header: "Permissions",
        render: (role: Role) => (
            <>
                {role.permissions.map((permission) => (
                    <RolePermissionIconTooltip
                        key={permission}
                        permission={permission}
                        iconProps={{ className: "mr-1" }}
                    />
                ))}
            </>
        ),
    },
    {
        key: "actions",
        header: "Actions",
        render: (role: Role) => (
            <>
                <EditRoleButton handleClick={() => setEditRole(role)} />
                <DeleteRoleButton
                    handleClick={() => {
                        if (
                            window.confirm(
                                "Êtes-vous sûr(e) de supprimer ce rôle ? Cette opération ne peut pas être annulée !"
                            )
                        ) {
                            remove(role.id);
                        }
                    }}
                />
            </>
        ),
    },
];

export const AssociationRolesAdministration = ({
                                                   association,
                                               }: {
    association: Association;
}) => {
    const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);

    // The Role currently edited in the modal.
    const [editRole, setEditRole] = useState<Role | null>(null);

    const [remove] = useMutation(api.roles.delete, {
        onSuccess: () => sendSuccessToast("Rôle supprimé."),
        onError: (response) =>
            sendErrorToast(
                `Une erreur est survenue: ${JSON.stringify(
                    (response as any).data
                )}.`
            ),
        onSettled: () => queryCache.refetchQueries("roles.list"),
    });

    const { columns, sorting } = useColumns<Role>(
        columnData(setEditRole, remove)
    );

    return association.myRole?.permissions?.includes("administration") ? (
        <>
            <EditRoleModal
                show={editRole !== null}
                onHide={() => setEditRole(null)}
                role={editRole}
            />
            <Pagination
                apiKey={[
                    "roles.list",
                    {
                        association: association.id,
                        ordering: sortingToApiParameter(sorting, {
                            member: "user__last_name",
                            role: "role",
                            startDate: "start_date",
                            endDate: "end_date",
                        }),
                    },
                ]}
                apiMethod={api.roles.list}
                render={(roles, paginationControl) => (
                    <Container className="mt-4">
                        <PageTitle>Gestion des membres</PageTitle>

                        <Card>
                            <Table columns={columns} data={roles} />
                            {paginationControl}
                        </Card>
                    </Container>
                )}
                paginationControlProps={{
                    className: "justify-content-center mt-5",
                }}
            />
        </>
    ) : (
        <ForbiddenError />
    );
};
