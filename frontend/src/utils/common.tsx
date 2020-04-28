import React from "react";

/**
 * This files should contain helpers for regularly used components that
 * require an important number of nested objects or classes.
 */

export const PageTitle = props => (
    <div className="page-header">
        <h1 className="page-title">{props.children}</h1>
    </div>
);
