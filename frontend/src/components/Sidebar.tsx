import React from 'react';
import {Link} from "react-router-dom";
import {SidebarButton} from "../utils/sidebar_button";
import "./sidebar.css";
import Container from 'react-bootstrap/Container';

type Props = {
    actions: SidebarButton[]
};

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
