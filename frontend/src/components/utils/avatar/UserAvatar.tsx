import React from "react";
import { Size } from "../../../utils/size";
import { TablerColor } from "../../../utils/colors";
import { Avatar } from "./Avatar";
import { Link } from "react-router-dom";
import "./user_avatar.css";

export interface UserAvatarProps {
    userId: string;
    size?: Size;
    backgroundColor?: TablerColor;
    linkClassName?: string;
    avatarClassName?: string;
    tooltip?: string;
    link?: boolean;
}

/**
 * Wrapper over `Avatar` to display the avatar of an user.
 *
 * @param userId the user ID.
 * @param size optional, the size of the avatar, a `Size`. Defaults to `Large`.
 * @param backgroundColor optional, the color of the avatar, a `TablerColor`. Defaults to `Gray`.
 * @param linkClassName optional, the classes added to the optional `a` element surrounding the `Avatar`.
 * @param avatarClassName optional, the classes added to the `Avatar` element.
 * @param tooltip optional, a tooltip to display when the avatar is hovered.
 * @param link optional. If true, add a link to the user profile. Defaults to true.
 */
export const UserAvatar = ({
    userId,
    size,
    backgroundColor,
    linkClassName,
    avatarClassName,
    tooltip,
    link = true,
}: UserAvatarProps) => {
    const avatar = (
        <Avatar
            url={`/profile/${userId}`}
            size={size}
            backgroundColor={backgroundColor}
            className={avatarClassName}
            tooltip={tooltip}
        />
    );

    return link ? (
        <Link
            to={`/profils/${userId}`}
            className={`user-avatar-link ${linkClassName ? linkClassName : ""}`}
        >
            {avatar}
        </Link>
    ) : (
        avatar
    );
};
