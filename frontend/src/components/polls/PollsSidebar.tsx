import React from "react";
import { Sidebar, SidebarItem } from "../Sidebar";

type Props = {
    adminVersion?: boolean;
};

export function PollsSidebar(props: Props) {
    return (
        <Sidebar title="Sondages">
            <SidebarItem icon="clock" to="/sondages/">
                Récents
            </SidebarItem>
            <SidebarItem icon="plus" to="/sondages/proposer/">
                Proposer
            </SidebarItem>
            <SidebarItem icon="check-square" to="/sondages/mes-sondages/">
                Mes sondages
            </SidebarItem>
            {props.adminVersion ? (
                <SidebarItem icon="shield" to="/sondages/administration/">
                    Administration
                </SidebarItem>
            ) : null}
        </Sidebar>
    );
}
