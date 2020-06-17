import React from "react";

/**
 * Display an avatar list.
 * @param stacked optional, if true, the avatar list will be stacked. Defaults to false.
 * @param className optional, applied to the surrounding div.
 * @param children the `Avatar` or `UserAvatar` components which will be rendered inside the list.
 */
export const AvatarList = ({
  stacked = false,
  className = "",
  children,
}: {
  stacked?: boolean;
  className?: string;
  children: any;
}) => (
  <div
    className={
      (className || "") +
      " " +
      (stacked ? "avatar-list-stacked" : "avatar-list")
    }
  >
    {children}
  </div>
);
