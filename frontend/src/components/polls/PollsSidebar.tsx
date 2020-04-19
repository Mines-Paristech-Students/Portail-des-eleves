import React from "react";
import { Sidebar, SidebarItem, SidebarSeparator } from "../Sidebar";

type Props = {
    adminVersion?: boolean;
};

export function PollsSidebar(props: Props) {
    return (
        <Sidebar title="Sondages">
            <SidebarItem icon="clock" to="/sondages/">
                En cours
            </SidebarItem>
            <SidebarItem icon="inbox" to="/sondages/anciens/">
                Anciens
            </SidebarItem>
            <SidebarItem icon="plus" to="/sondages/proposer/">
                Proposer
            </SidebarItem>
            <SidebarSeparator />
            <SidebarItem icon="check-square" to="/sondages/mes-sondages/">
                Mes sondages
            </SidebarItem>
            <SidebarSeparator />
            {props.adminVersion ? (
                <SidebarItem icon="shield" to="/sondages/administration/">
                    Administration
                </SidebarItem>
            ) : null}
        </Sidebar>
    );
}
