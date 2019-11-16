import React from 'react';
import {Link} from "react-router-dom";
import {LinkData} from "../utils/link_data";
import "./action_bar.css";
import Container from 'react-bootstrap/Container';

type Props = {
    actions?: Array<LinkData>
};

/**
 * Display a bar with links rendered as buttons.
 */
// TODO: make it more customizable (style the buttons for instance). Use a dedicated structure (ActionData instead of LinkData).
export function ActionBar(props: Props) {
    return (
        <Container className="action-bar">
            {
                props.actions &&
                props.actions.map(
                    linkData => <Link to={linkData.to} className="btn btn-outline-primary" key={linkData.name}>
                        {linkData.name}
                    </Link>
                )
            }
        </Container>
    );
}
