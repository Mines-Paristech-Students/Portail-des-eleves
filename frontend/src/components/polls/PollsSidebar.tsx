import React from "react";
import { Sidebar, SidebarItem, SidebarSeparator } from "../Sidebar";

export const PollsSidebar = ({
    isStaff,
    actions,
}: {
    isStaff: boolean;
    actions?: any;
}) => (
    <Sidebar title="Sondages">
        <SidebarItem icon="clock" to="/sondages/">
            En cours
        </SidebarItem>
        <SidebarItem icon="inbox" to="/sondages/anciens/">
            Anciens
        </SidebarItem>
        <SidebarSeparator />
        <SidebarItem icon="check-square" to="/sondages/mes-sondages/">
            Mes sondages
        </SidebarItem>
        <SidebarItem icon="plus" to="/sondages/proposer/">
            Proposer
        </SidebarItem>
        <SidebarSeparator />
        {isStaff ? (
            <SidebarItem icon="shield" to="/sondages/administration/">
                Administration
            </SidebarItem>
        ) : null}
        {actions && <div className="mt-5 pt-5 border-top">{actions}</div>}
    </Sidebar>
);
