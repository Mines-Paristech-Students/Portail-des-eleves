import React from "react";
import { Column } from "./TableHeader";

const Row = ({ columns, data }: { columns: Column[]; data: object }) => (
  <tr role="row">
    {columns.map((column, i) => (
      <td key={i} className={column.cellClassName}>
        {column.render !== undefined ? column.render(data) : data[column.key]}
      </td>
    ))}
  </tr>
);

export const TableBody = ({
  columns,
  data,
}: {
  columns: Column[];
  data: object[];
}) => (
  <tbody>
    {data.map((rowData, i) => (
      <Row key={i} columns={columns} data={rowData} />
    ))}
  </tbody>
);
