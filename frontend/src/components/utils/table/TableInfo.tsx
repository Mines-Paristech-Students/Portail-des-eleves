import { decidePlural } from "../../../utils/format";
import React from "react";

export const TablesInfo = ({
    itemNameSingular,
    itemNamePlural,
    pageEntryMin,
    pageEntryMax,
    entriesCount
}: {
    itemNameSingular: string;
    itemNamePlural: string;
    pageEntryMin: number;
    pageEntryMax: number;
    entriesCount: number;
}) => (
    <div className="dataTables_info" role="status">
        <span className="text-capitalize">{itemNamePlural}</span> {pageEntryMin}{" "}
        à {pageEntryMax} (
        {decidePlural(entriesCount, itemNameSingular, itemNamePlural)}{" "}
        {entriesCount} au total).
    </div>
);
