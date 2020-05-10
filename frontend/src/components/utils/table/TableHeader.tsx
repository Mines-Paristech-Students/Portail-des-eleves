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

export type Columns = Column[];

const HeaderRow = ({ columns }: { columns: Columns }) => (
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

export const TableHeader = ({ columns }: { columns: Columns }) => (
    <thead>
        <HeaderRow columns={columns} />
    </thead>
);
