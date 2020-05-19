import React from "react";

/**
 * Display an avatar list.
 * @param stacked optional, if true, the avatar list will be stacked. Defaults to false.
 * @param children the `Avatar` or `UserAvatar` components which will be rendered inside the list.
 */
export const AvatarList = ({
    stacked = false,
    children,
}: {
    stacked?: boolean;
    children: any;
}) => (
    <div className={stacked ? "avatar-list-stacked" : "avatar-list"}>
        {children}
    </div>
);
