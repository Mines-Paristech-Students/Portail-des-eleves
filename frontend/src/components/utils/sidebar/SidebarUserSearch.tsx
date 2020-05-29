import React from "react";

import AsyncSelect from "react-select/async";
import { api } from "../../../services/apiService";
import { User } from "../../../models/user";

const promiseOptions = (inputValue) =>
    api.users.list({ page_size: 20, search: inputValue }).then((res) =>
        res.results.map((user) => ({
            label: user.id,
            value: user,
        }))
    );

/**
 * Debounced input field for the sidebar
 * @param setParams the useState function to update the `search` param
 * @param paramKey the name of the parameter in the API query. "user" by default
 * @param props Props to give to the Input field
 * @constructor
 *
 * Usage example :
 * [search, setSearch] = useState({});
 * return <SidebarInputSearch setParams={setSearch} paramKey="buyer"/>
 *
 * The value of search after "something" was typed is :
 * {buyer: something}
 */
export const SidebarUserSearch = ({ setParams, paramKey = "", ...props }) => (
    <AsyncSelect
        cacheOptions
        defaultOptions
        loadOptions={promiseOptions}
        placeholder={"Rechercher un utilisateur"}
        className={"mb-3"}
        isClearable={true}
        {...props}
        onChange={(value) => {
            const user = (value as { label: string; value: User })?.value;
            setParams(user ? { [paramKey || "user"]: user.id } : {});
        }}
    />
);
