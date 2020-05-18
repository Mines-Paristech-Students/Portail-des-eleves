import React from "react";
import Card from "react-bootstrap/Card";
import { UserAvatar, UserAvatarProps } from "./UserAvatar";
import { Size } from "../../../utils/size";

/**
 * Display the user's avatar in a card with `children` below.
 *
 * This will not look good unless it's used in a `Col`. Recommended: on full width, `lg={2} sm={3}` with Size=Size.XXL (default).
 *
 * Except `children`, the props are the same as `UserAvatar`.
 */
export const UserAvatarCard = ({
    children,
    className = "",
    userId,
    avatarClassName,
    linkClassName,
    size = Size.XXL,
    link = true,
    ...props
}: {
    children?: any;
    className?: string;
    avatarClassName?: string;
} & UserAvatarProps) => (
    <Card className={`justify-content-center ${className}`}>
        <UserAvatar
            userId={userId}
            className={avatarClassName}
            linkClassName={"mx-auto " + (linkClassName ? linkClassName : "")}
            size={size}
            link={link}
            {...props}
        />

        {children}
    </Card>
);
