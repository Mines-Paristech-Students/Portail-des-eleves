import React from "react";
import Card from "react-bootstrap/Card";
import { UserAvatar, UserAvatarProps } from "./UserAvatar";
import { Size } from "../../../utils/size";

/**
 * Display the user's avatar in a card with `children` below.
 *
 * This will not look good unless it's used in a `Col`. Recommended: on full width, `lg={2} sm={3}` with Size=Size.XXL (default).
 *
 * Except `children`, the props are the same as `UserAvatar`. `legend` defaults to `userId`.
 */
export const UserAvatarCard = ({
    children,
    userId,
    linkClassName,
    size = Size.XXL,
    link = true,
    ...props
}: { children?: any } & UserAvatarProps) => (
    <Card className="justify-content-center p-3">
        <UserAvatar
            userId={userId}
            linkClassName={"mx-auto " + (linkClassName ? linkClassName : "")}
            size={size}
            link={link}
            {...props}
        />

        {children}
    </Card>
);
