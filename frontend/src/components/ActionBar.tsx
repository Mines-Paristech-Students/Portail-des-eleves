import React from 'react';
import {Link} from "react-router-dom";
import {LinkData} from "../utils/LinkData";
import "./action_bar.css";

type Props = {
    actions?: Array<LinkData>
};

/**
 * Display a bar with links rendered as buttons.
 */
export function ActionBar(props: Props) {
    return (
        <div className="action-bar">
            {
                props.actions &&
                props.actions.map(
                    linkData => <Link to={linkData.to} className="btn btn-outline-primary" key={linkData.name}>
                        {linkData.name}
                    </Link>
                )
            }
        </div>
    );
}
