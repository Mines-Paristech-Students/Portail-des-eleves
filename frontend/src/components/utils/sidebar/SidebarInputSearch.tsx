import React, { useEffect } from "react";
import { DebounceInput } from "react-debounce-input";
import { useURLState } from "../../../utils/useURLState";

/**
 * Debounced input field for the sidebar
 * @param setParams the useState function to update the `search` param
 * @param props Props to give to the Input field
 * @constructor
 *
 * Usage example :
 * [search, setSearch] = useState({});
 * return <SidebarInputSearch setParams={setSearch}/>
 *
 * The value of search after "something" was typed is :
 * {search: something}
 */
export const SidebarInputSearch = ({ setParams, ...props }) => {
    const [searchValue, setSearchValue] = useURLState("search", "");

    useEffect(() => {
        setParams({ search: searchValue });
    }, [searchValue, setParams]);

    return (
        <div className="input-icon mb-3">
            <DebounceInput
                className="form-control input-sm"
                type="text"
                placeholder="Chercher"
                debounceTimeout={300}
                minLength={2}
                onChange={(e) => setSearchValue(e.target.value)}
                value={searchValue}
                {...props}
            />
            <span className="input-icon-addon">
                <i className="fe fe-search" />
            </span>
        </div>
    );
};
