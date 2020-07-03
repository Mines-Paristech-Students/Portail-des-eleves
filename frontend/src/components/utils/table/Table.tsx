import React, { useState } from "react";
import { TableBody } from "./TableBody";
import { Column, TableHeader } from "./TableHeader";
import { Sorting } from "./sorting";

/**
 * A Table which may display and manage sorting buttons on its header and update provided `Sorting` states accordingly.
 *
 * @param columns a list of `Column` objects. If the `Table` does not need a sorting, pass a list of `{ key, header, render }`
 * object; otherwise, it's more convenient to use `useColumns`.<br />
 * `key` is a string, unique among the other keys.<br />
 * `header` is a component which will be displayed in the header row.<br />
 * `render` is an optional function. If specified, `render(data)` will be used to fill the cell located in the
 * `data` row and the `key` column. Otherwise, `data[key]` will be used.<br />
 * `headerClassName` will be appended to the class of the `th` element containing `header`.<br />
 * `cellClassName` will be appended to the class of the `<td>` elements located in the `key` column.<br />
 * @param data a list of objects (one item per row) which will be used to fill the table.
 * @param props props to apply to the  table
 * @param dataTable if true (by default), the table will be a datatable.
 * @param emptyComponent displayed in the first row if `data` is empty. Defaults to a generic message.
 * @param borderTop default to true. If false, the top border of the table is removed (useful when embedding a table
 * in a card).
 */
export const Table = ({
  columns,
  data,
  showHeaders = true,
  dataTable = true,
  emptyComponent = <p className="text-center m-0">Pas de résultats.</p>,
  borderTop = true,
}: {
  columns: Column[];
  data: object[];
  showHeaders?: boolean;
  dataTable?: boolean;
  emptyComponent?: React.ReactNode;
  borderTop?: boolean;
}) => (
  <div className="table-responsive">
    <div className={`${dataTable ? "dataTables_wrapper" : ""} no-footer`}>
      <table
        className={`table card-table table-vcenter ${
          dataTable ? "datatable dataTable" : ""
        } no-footer table-striped ${!borderTop && "border-top-0"}`}
        role="grid"
      >
        {showHeaders && <TableHeader columns={columns} />}
        <TableBody
          columns={columns}
          data={data}
          emptyComponent={emptyComponent}
        />
      </table>
    </div>
  </div>
);

/**
 * Return a `Column[]` object ready to be injected into a `Table` component, as well as a `sorting` object containing
 * the `Sorting` associated to the `Table` columns. You can then use the value of `sorting[key]` to decide with which
 * `data` your `Table` should be fed.
 *
 * Note that you only need to use this component if you plan to use a sorting. Otherwise, it's a pretty useless
 * overhead.
 *
 * @param columns an array of objects `{ key, header, render, canSort }`.<br />
 * `key` is a string, unique among the other keys.<br />
 * `header` is a component which will be displayed in the header row.<br />
 * `render` is an optional function. If specified, `render(data)` will be used by the `Table` component to generate
 * the cell located in the `data` row and the `key` column. Otherwise, `data[key]` will be used.<br />
 * If `canSort` is truthy, then `sorting[key]` will contain a `Sorting` object linked to the column sort state.<br/>
 * `headerClassName` will be appended to the class of the `th` element containing `header`.<br />
 * `cellClassName` will be appended to the class of the `<td>` elements located in the `key` column.<br />
 */
export function useColumns<T = any>(
  columns: {
    key: string;
    header: any;
    render?: (data: T) => any;
    canSort?: boolean;
    headerClassName?: any;
    cellClassName?: any;
  }[]
): { columns: Column[]; sorting: { [key: string]: Sorting } } {
  // Build an initial sorting object filled with `Sorting.Unsorted`.
  let initialSorting = {};

  for (let { key, canSort } of columns) {
    if (canSort) {
      initialSorting[key] = Sorting.Unsorted;
    }
  }

  const [sorting, setSorting] = useState(initialSorting);

  return {
    columns: columns.map(
      ({ key, header, render, canSort, headerClassName, cellClassName }) => {
        // Even if the column does not need a sort, it requires these attributes.
        let base = {
          key: key,
          header: header,
          render: render,
          headerClassName: headerClassName,
          cellClassName: cellClassName,
        };

        // If the column needs a sort, add the `sorting` state and the `onChangeSorting` mutating function.
        return canSort
          ? {
              ...base,
              sorting: sorting[key],
              onChangeSorting: (newSort?: Sorting) =>
                setSorting((_) => {
                  let newState = { ...initialSorting };
                  newState[key] = newSort;
                  return newState;
                }),
            }
          : base;
      }
    ),
    sorting: sorting,
  };
}
