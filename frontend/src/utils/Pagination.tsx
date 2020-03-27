import { useState } from "react";
import { usePaginatedQuery } from "react-query";

export const Pagination = () => {
    // https://github.com/tannerlinsley/react-query#paginated-queries-with-usepaginatedquery
    let [page, setPage] = useState(0);

    const fetchProjects = (key, page = 0) =>
        fetch("/api/projects?page=" + page);

    const {
        status,
        resolvedData,
        latestData,
        error,
        isFetching
    } = usePaginatedQuery(["projects", page], fetchProjects);
};
