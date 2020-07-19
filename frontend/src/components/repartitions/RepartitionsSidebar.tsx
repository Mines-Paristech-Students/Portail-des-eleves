import React from "react";
import {
  Sidebar,
  SidebarItem,
  SidebarSeparator,
} from "../utils/sidebar/Sidebar";

export const RepartitionsSidebar = ({ actions }: { actions?: any }) => (
  <Sidebar title="Répartitions">
    <SidebarItem icon="plus" to="/repartitions/NewRepartition">
      Nouvelle répartition
    </SidebarItem>
    {actions && (
      <>
        <SidebarSeparator /> {actions}
      </>
    )}
  </Sidebar>
);
