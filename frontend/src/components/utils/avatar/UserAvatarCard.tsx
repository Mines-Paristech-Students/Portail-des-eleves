import React from "react";
import Card from "react-bootstrap/Card";
import { UserAvatar, UserAvatarProps } from "./UserAvatar";
import { Size } from "../../../utils/size";

/**
 * Display `UserAvatar` in a card with `children` below.
 *
 * This will not look good unless it's used in a `Col`. Recommended: on full width, `lg={2} sm={3}` with Size=Size.XXL (default).
 *
<<<<<<< HEAD
 * @param children components to add below the `UserAvatar`.
 * @param userId the user ID.
 * @param className optional, the classes added to the `Card` component.
 * @param size optional, the size of the avatar, a `Size`. Defaults to `Large`.
 * @param linkClassName optional, the classes added to the optional `a` element surrounding the `Avatar`.
 * @param avatarClassName optional, the classes added to the `Avatar` element.
 * @param tooltip optional, a tooltip to display when the avatar is hovered.
 * @param link optional. If true, add a link to the user profile. Defaults to true.
 * @param props these props will be passed to `UserAvatar`.
 * @constructor
=======
 * Except `children`, the props are the same as `UserAvatar`.
>>>>>>> master
 */
export const UserAvatarCard = ({
    children,
    userId,
    className = "",
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
            avatarClassName={avatarClassName}
            linkClassName={"mx-auto " + (linkClassName ? linkClassName : "")}
            size={size}
            link={link}
            {...props}
        />

        {children}
    </Card>
);
