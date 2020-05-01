import React from "react";

/**
 * This file should contain helpers for regularly used components that
 * require an important number of nested objects or classes.
 */

export const PageTitle = props => (
    <div className="page-header mt-0">
        <h1 className="page-title">{props.children}</h1>
    </div>
);
