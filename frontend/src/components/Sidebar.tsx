import React from 'react';
import {Link} from "react-router-dom";
import "./sidebar.css";
import Container from 'react-bootstrap/Container';

type Props = {
    actions: SidebarButton[]
};

/**
 * Simple interface to represent a sidebar button.
 */
export interface SidebarButton {
    name: string;
    to: string;
    style?: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "light" | "dark" | "outline-primary" | "outline-secondary" | "outline-success" | "outline-warning" | "outline-danger" | "outline-info" | "outline-light" | "outline-dark";

    /**
     * A lower order should mean higher in the sidebar.
     */
    order?: number;
}

/**
 * Display a sidebar with links rendered as buttons.
 */
export function Sidebar(props: Props) {
    return (
        <Container className="sidebar">
            {
                props.actions
                // Lower order first.
                    .sort((a, b) => Number(a.order) - Number(b.order))
                    .map(function (sidebarData) {
                        const buttonStyle = sidebarData.style ? "btn-" + sidebarData.style : "btn-outline-primary";

                        return (
                            <Link to={sidebarData.to} className={"btn my-1 " + buttonStyle} key={sidebarData.name}>
                                {sidebarData.name}
                            </Link>
                        )
                    }
                )
            }
        </Container>
    );
}
