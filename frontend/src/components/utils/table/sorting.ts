export enum Sorting {
    Unsorted,
    Ascending,
    Descending,
}

/**
 * Return the CSS class for the header corresponding to `sorting`.
 */
export const sortingToClassName = (sorting?: Sorting) =>
    sorting === Sorting.Unsorted
        ? "sorting"
        : sorting === Sorting.Ascending
        ? "sorting_asc"
        : sorting === Sorting.Descending
        ? "sorting_desc"
        : "";

/**
 * Cycle through the sorting like this: Unsorted -> Ascending -> Descending -> Unsorted
 */
export const cycleSorting = (current?: Sorting) =>
    current === Sorting.Unsorted
        ? Sorting.Ascending
        : current === Sorting.Ascending
        ? Sorting.Descending
        : current === Sorting.Descending
        ? Sorting.Unsorted
        : undefined;

/**
 * Build an URL sorting parameter from a `sorting` object. The function iterates through the object's keys and returns
 * the sorting parameter corresponding to the _first_ key containing either `Sorting.Ascending` or `Sorting.Descending`
 * (in other words, multi-sort is _not_ supported).
 *
 * @param sorting an object (like those given by `useColumns`) mapping `Sorting` objects to keys.
 * @param mapping an optional object which maps the key used by `sorting` to the keys used by the backend. Useful for
 * converting camelCase into snake_case.
 */
export const sortingToApiParameter = (sorting: any, mapping?: any) => {
    if (sorting === undefined) {
        return "";
    }

    for (let key of Object.getOwnPropertyNames(sorting)) {
        switch (sorting[key]) {
            case Sorting.Ascending:
                return `${mapping ? mapping[key] : key}`;
            case Sorting.Descending:
                return `-${mapping ? mapping[key] : key}`;
        }
    }

    return "";
};
