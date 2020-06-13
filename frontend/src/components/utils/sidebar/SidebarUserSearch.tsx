import React, { useEffect, useState } from "react";

import { api, useBetterPaginatedQuery } from "../../../services/apiService";
import { User } from "../../../models/user";
import Select from "react-select";
import { ErrorMessage } from "../ErrorPage";
import { useURLState } from "../../../utils/useURLState";

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
export const SidebarUserSearch = ({ setParams, apiKey = "user", ...props }) => {
    const [inputValue, setInputValue] = useState("");
    const [selectedUser, setSelectedUser] = useState<{
        label: string;
        value: User;
    } | null>(null);
    const [selectedUserId, setSelectedUserId] = useURLState<string | null>(
        "user",
        null,
        (user) => user || "",
        (data) => data
    );

    const { resolvedData: users, status, error } = useBetterPaginatedQuery<any>(
        ["users.list", { page_size: 20, search: inputValue }],
        api.users.list
    );

    const onChange = (value) => {
        const user = (value as { label: string; value: User })?.value;
        setSelectedUserId(user?.id);
        setSelectedUser(value);
    };

    useEffect(() => {
        // This effect will be called when the page is loaded, selectedUserId
        // parsed but there is not selectedUser yet
        if (users && selectedUserId) {
            setSelectedUser((selectedUser) => {
                if (selectedUser) return selectedUser;

                const selectedUsers = users.results.filter(
                    (u) => u.id === selectedUserId
                );
                const newSelectedUser =
                    selectedUsers.length >= 1 ? selectedUsers[0] : null;

                return { value: newSelectedUser, label: newSelectedUser.id };
            });
        }
    }, [selectedUserId, users]);

    useEffect(() => {
        setParams(
            selectedUser?.value
                ? { [apiKey || "user"]: selectedUser.value.id }
                : {}
        );
    }, [setParams, selectedUser, apiKey]);

    return status === "loading" ? null : status === "error" ? (
        <ErrorMessage>{error}</ErrorMessage>
    ) : users ? (
        <Select
            placeholder={"Rechercher un utilisateur"}
            className={"mb-3"}
            isClearable={true}
            options={users.results.map((user) => ({
                label: user.id,
                value: user,
            }))}
            {...props}
            onInputChange={setInputValue}
            onChange={onChange}
            value={selectedUser}
        />
    ) : null;
};
