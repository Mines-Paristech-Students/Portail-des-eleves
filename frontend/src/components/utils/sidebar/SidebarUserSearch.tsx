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
 * Debounced user search field for the sidebar. Use it to look for a user in the
 * whole database.
 * @param setParams the callback function to update the `search` param
 * @param apiKey the name of the parameter in the API query. "user" by default
 * @param props Props to give to the Input field
 * @constructor
 *
 * Usage example :
 * [search, setSearch] = useState({});
 * return <SidebarInputSearch setParams={setSearch} apiKey="buyer"/>
 *
 * The value of search after "something" was typed is :
 * {buyer: something}
 */
export const SidebarUserSearch = ({ setParams, apiKey = "user", ...props }) => (
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
            setParams(user ? { [apiKey || "user"]: user.id } : {});
        }}
    />
);
