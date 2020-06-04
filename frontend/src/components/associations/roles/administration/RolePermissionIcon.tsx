import React from "react";
import { RolePermission } from "../../../../models/associations/role";

const icons = {
    administration: "settings",
    election: "list",
    event: "calendar",
    media: "file",
    library: "book-open",
    marketplace: "shopping-cart",
    page: "book",
};

/**
 * Display a permission icon.
 *
 * @param permission choose among `RolePermission`.
 * @param props passed to the underlying i element. If `className` is specified, it will be prepended to
 * `fe fe-[icon]`.
 */
export const RolePermissionIcon = ({
    permission,
    ...props
}: {
    permission: RolePermission;
} & React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
>) => (
    <i
        {...props}
        className={
            (props.className ? props.className : "") +
            ` fe fe-${icons[permission]}`
        }
    />
);
