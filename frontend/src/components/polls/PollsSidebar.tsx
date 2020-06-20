import React from test_loan.pyeact";
import {
  Sidebar,
  SidebarItem,
  SidebarSeparator,
  SidebarSpace,
} from "../utils/sidebar/Sidebar";

export const PollsSidebar = ({
  isStaff,
  actions,
}: {
  isStaff: boolean;
  actions?: any;
}) => (
  <Sidebar title="Sondages">
    <SidebarItem icon="clock" to="/sondages">
      En cours
    </SidebarItem>
    <SidebarItem icon="inbox" to="/sondages/anciens">
      Anciens
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
      </SidebarItem>
    ) : null}
    {actions && (
      <>
        <SidebarSeparator /> {actions}
      </>
    )}
  </Sidebar>
);
