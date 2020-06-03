import React from "react";

export const PageTitle = ({className, children}: {className?: string; children: any}) => (
    <div className={className || "mt-2 mb-2"}>
        <h1 className="page-title">{children}</h1>
    </div>
);
