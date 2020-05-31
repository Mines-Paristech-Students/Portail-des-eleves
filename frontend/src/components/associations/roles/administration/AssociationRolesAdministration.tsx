import React, { useState } from "react";
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
import { RolePermissionIcon } from "./RolePermissionIcon";

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

export const AssociationRolesAdministration = ({
    association,
}: {
    association: Association;
}) => {
    // The Role currently edited in the modal.
    const [, setEditRole] = useState<Role | null>(null);

    const columnData = [
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
                        <RolePermissionIcon
                            key={permission}
                            permission={permission}
                            className="mr-1"
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
                        handleClick={() => console.log("delete")}
                    />
                </>
            ),
        },
    ];

    const { columns, sorting } = useColumns<Role>(columnData);

    return (
        <>
            <Pagination
                apiKey={[
                    "associations.roles.list",
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
    );
};
