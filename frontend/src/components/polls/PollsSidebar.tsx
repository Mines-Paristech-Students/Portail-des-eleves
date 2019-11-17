import React from 'react';
import {SidebarButton} from "../Sidebar";
import {Sidebar} from "../Sidebar";

type Props = {
    adminVersion?: boolean
};

export function PollsSidebar(props: Props) {
    const actions: SidebarButton[] = [
        {
            name: "Récents",
            to: "/sondages/",
            order: 10,
        },
        {
            name: "Proposer",
            to: "/sondages/proposer/",
            order: 20,
        },
        {
            name: "Mes sondages",
            to: "/sondages/mes-sondages/",
            order: 30,
        },
    ];

    if (props.adminVersion || true) { // TODO. For debugging
        actions.push({
            name: "Administration",
            to: "/sondages/administration/",
            order: 0,
            style: "outline-danger",
        })
    }

    return <Sidebar actions={actions}/>;
}
