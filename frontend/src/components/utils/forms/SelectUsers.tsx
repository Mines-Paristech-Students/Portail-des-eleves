import React, { useEffect, useState } from "react";
import Select, { OptionsType, components } from "react-select";
import {
    api,
    PaginatedResponse,
    useBetterQuery,
} from "../../../services/apiService";
import { User } from "../../../models/user";
import { useField } from "formik";
import "./select-users.css";

const Option = (props) => {
    return (
        <components.Option {...props}>
            <span className="image">
                <img
                    src={`/profile/${props.value}.jpg`}
                    alt={`Avatar de ${props.value}.`}
                />
            </span>
            <span className="title">{props.children}</span>
        </components.Option>
    );
};

const MenuList = (props) => {
    return (
        <components.MenuList {...props} className="selectize-dropdown">
            {props.children}
        </components.MenuList>
    );
};

const MultiValueLabel = (props) => (
    <components.MultiValueLabel {...props}>
        <img
            src={`/profile/${props.data.value}.jpg`}
            alt={`Avatar de ${props.data.value}.`}
            className="mr-1 select-users-value-label-img"
        />
        {props.children}
    </components.MultiValueLabel>
);

const MultiValue = components.MultiValue;

export const SelectUsers = ({
    isMulti = true,
    className = "",
    ...props
}: {
    isMulti?: boolean;
    name: string;
    className?: string;
    [key: string]: any;
}) => {
    const [, meta, helpers] = useField(props);
    const { value } = meta;
    const { setValue } = helpers;

    const { data } = useBetterQuery<PaginatedResponse<User[]>>(
        ["listUsers", {}, 1],
        api.users.list,
        {
            refetchOnWindowFocus: false,
        }
    );

    // react-select requires an `options` field of a special type. These hooks handle this.
    const [usersOptions, setUsersOptions] = useState<
        OptionsType<{ value: string; label: string }>
    >([]);

    useEffect(() => {
        if (data) {
            setUsersOptions(
                data.results.map((user) => {
                    return {
                        value: user.id,
                        label: `${user.firstName} ${user.lastName}`,
                    };
                })
            );
        }
    }, [data]);

    return (
        <Select
            isMulti={isMulti}
            closeMenuOnSelect={!isMulti}
            value={value}
            options={usersOptions}
            components={{
                Option,
                MenuList,
                MultiValueLabel,
                MultiValue,
            }}
            onChange={(newValue) => {
                setValue(newValue);
            }}
            placeholder="Sélectionner quelqu’un…"
        />
    );
};
