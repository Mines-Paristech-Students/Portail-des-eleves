import React from "react";
import {
  Sidebar,
  SidebarItem,
  SidebarSeparator,
  SidebarSpace,
} from "../utils/sidebar/Sidebar";
import { api, useBetterQuery } from "../../services/apiService";
import { SidebarBadge } from "../utils/sidebar/SidebarBadge";

export const PollsSidebar = ({
  isStaff,
  actions,
}: {
  isStaff: boolean;
  actions?: any;
}) => {
  const { data: stats, status } = useBetterQuery<{
    numberOfPendingPolls: number | null;
    numberOfAvailablePolls: number;
  }>(["polls.stats"], api.polls.stats);

  return (
    <Sidebar title="Sondages">
      <SidebarItem icon="check-circle" to="/sondages">
        En cours
        {status === "success" &&
          stats &&
          stats.numberOfAvailablePolls !== null && (
            <SidebarBadge variant="primary">
              {stats.numberOfAvailablePolls}
            </SidebarBadge>
          )}
      </SidebarItem>
      <SidebarSpace />
      <SidebarItem icon="check-square" to="/sondages/mes-sondages">
        Mes sondages
      </SidebarItem>
      <SidebarItem icon="plus" to="/sondages/proposer">
        Proposer
      </SidebarItem>
      <SidebarSpace />
      {isStaff ? (
        <SidebarItem icon="shield" to="/sondages/administration">
          Administration
          {status === "success" &&
            stats &&
            stats.numberOfPendingPolls !== null &&
            stats.numberOfPendingPolls > 0 && (
              <SidebarBadge variant="warning">
                {stats.numberOfPendingPolls}
              </SidebarBadge>
            )}
        </SidebarItem>
      ) : null}
      {actions && (
        <>
          <SidebarSeparator /> {actions}
        </>
      )}
    </Sidebar>
  );
};
