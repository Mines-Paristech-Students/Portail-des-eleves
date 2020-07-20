import React from "react";

export const PageTitle = ({
  className,
  children,
}: {
  className?: string;
  children: any;
}) => <h1 className={className || "page-title mt-2 mb-2"}>{children}</h1>;
