import React from "react";
import { cycleSorting, Sorting, sortingToClassName } from "./sorting";
import "./table_header.css";

export type Column = {
    key: string;
    header: any;
    render?: (data: any) => any;
    sorting?: Sorting;
    onChangeSorting?: (newSorting?: Sorting) => void;
};

const HeaderRow = ({ columns }: { columns: Column[] }) => (
    <tr role="row">
        {columns.map(({ header, key, sorting, onChangeSorting }) => (
            <th
                key={key}
                className={`noSelect ${
                    sorting !== undefined ? "pointer" : ""
                } ${sortingToClassName(sorting)}`}
                aria-label={`${key}`}
                onClick={
                    onChangeSorting
                        ? () => onChangeSorting(cycleSorting(sorting))
                        : undefined
                }
            >
                {header}
            </th>
        ))}
    </tr>
);

export const TableHeader = ({ columns }: { columns: Column[] }) => (
    <thead>
        <HeaderRow columns={columns} />
    </thead>
);
