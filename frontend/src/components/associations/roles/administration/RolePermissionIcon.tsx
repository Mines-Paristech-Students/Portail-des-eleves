import React from "react";
import { RolePermission } from "../../../../models/associations/role";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";

const icons = {
    administration: "settings",
    election: "list",
    event: "calendar",
    media: "file",
    library: "book-open",
    marketplace: "shopping-cart",
    page: "book",
};

const tooltips = {
    administration: "Administration",
    election: "Élections",
    event: "Événements",
    media: "Fichiers",
    library: "Bibliothèque",
    marketplace: "Magasin",
    page: "Pages",
};

export const RolePermissionIcon = ({
    permission,
    ...props
}: {
    permission: RolePermission;
} & React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
>) => (
    <OverlayTrigger
        placement="bottom"
        delay={{ show: 200, hide: 0 }}
        overlay={
            <Tooltip id={`${permission}-tooltip`}>
                {tooltips[permission]}
            </Tooltip>
        }
    >
        <i
            {...props}
            className={
                (props.className ? props.className : "") +
                ` fe fe-${icons[permission]}`
            }
        />
    </OverlayTrigger>
);
