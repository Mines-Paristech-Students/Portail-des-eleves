import React from "react";
import { Columns } from "./TableHeader";

const Row = ({
    columns,
    data,
    index
}: {
    columns: Columns;
    data: object;
    index: number;
}) => (
    <tr role="row" className={index % 2 == 0 ? "even" : "odd"}>
        {columns.map((column, i) => (
            <td key={i} className={column.cellClassName}>
                {column.render !== undefined
                    ? column.render(data)
                    : data[column.key]}
            </td>
        ))}
    </tr>
);

export const TableBody = ({
    columns,
    data
}: {
    columns: Columns;
    data: object[];
}) => (
    <tbody>
        {data.map((rowData, i) => (
            <Row key={i} columns={columns} data={rowData} index={i} />
        ))}
    </tbody>
);
