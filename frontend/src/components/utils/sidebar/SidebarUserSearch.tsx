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

export const SidebarUserSearch = ({ setParams, userName = "", ...props }) => (
    <AsyncSelect
        cacheOptions
        defaultOptions
        loadOptions={promiseOptions}
        placeholder={"Rechercher un utilisateur"}
        className={"mb-3"}
        isClearable={true}
        {...props}
        onChange={(value) => {
            let user = (value as { label: string; value: User })?.value;
            setParams(user ? { [userName || "user"]: user.id } : {});
        }}
    />
);
