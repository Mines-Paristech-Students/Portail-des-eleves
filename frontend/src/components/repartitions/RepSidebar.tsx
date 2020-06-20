import React from "react";
import {
  Sidebar,
  SidebarItem,
  SidebarSeparator,
  SidebarSpace,
} from "../utils/sidebar/Sidebar";

export const RepSidebar = ({
  isStaff,
  actions,
}: {
  isStaff: boolean;
  actions?: any;
}) => (
  <Sidebar title="Répartitions">
    <SidebarItem icon="plus" to="/repartitions/nouveau">
      Nouvelle répartition
    </SidebarItem>
    <SidebarItem icon="inbox" to="/repartitions/anciens">
      Anciennes
    </SidebarItem>
    {actions && (
      <>
        <SidebarSeparator /> {actions}
      </>
    )}
  </Sidebar>
);
