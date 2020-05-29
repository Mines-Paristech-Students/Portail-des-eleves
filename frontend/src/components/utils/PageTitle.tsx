import React from "react";

export const PageTitle = (props) => (
    <div className="page-header mt-2 mb-2">
        <h1 className="page-title">{props.children}</h1>
    </div>
);
