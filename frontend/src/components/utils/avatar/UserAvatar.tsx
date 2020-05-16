import React from "react";
import { Size } from "../../../utils/size";
import { TablerColor } from "../../../utils/colors";
import { Avatar } from "./Avatar";
import { Link } from "react-router-dom";
import "./user_avatar.css";

/**
 * Thin wrapper over `Avatar` to display the avatar of an user.
 *
 * @param userId the user ID.
 * @param size optional, the size of the avatar, a `Size`. Defaults to `Large`.
 * @param backgroundColor optional, the color of the avatar, a `TablerColor`. Defaults to `Gray`.
 * @param className optional, the classes to add to `Avatar`.
 * @param tooltip optional, a tooltip to display when the avatar is hovered.
 * @param link optional. If true, add a link to the user profile. Defaults to true.
 */
export const UserAvatar = ({
    userId,
    size,
    backgroundColor,
    className,
    tooltip,
    link = true,
}: {
    userId: string;
    size?: Size;
    backgroundColor?: TablerColor;
    className?: string;
    tooltip?: string;
    link?: boolean;
}) => {
    const avatar = (
        <Avatar
            url={`/profile/${userId}`}
            size={size}
            backgroundColor={backgroundColor}
            className={className}
            tooltip={tooltip}
        />
    );
    return link ? (
        <Link to={`/profils/${userId}`} className="user-avatar-link">
            {avatar}
        </Link>
    ) : (
        avatar
    );
};
