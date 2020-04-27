import React from "react";
import { Sidebar, SidebarItem, SidebarSeparator } from "../Sidebar";

export const PollsSidebar = ({ isAdmin }: { isAdmin: boolean }) => (
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
        {isAdmin ? (
            <SidebarItem icon="shield" to="/sondages/administration/">
                Administration
            </SidebarItem>
        ) : null}
    </Sidebar>
);
