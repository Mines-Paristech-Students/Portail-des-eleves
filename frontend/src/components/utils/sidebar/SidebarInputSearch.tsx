import React from "react";
import { DebounceInput } from "react-debounce-input";

export const SidebarInputSearch = ({ setParams, ...props }) => (
    <div className="input-icon mb-3">
        <DebounceInput
            className="form-control input-sm"
            type="text"
            placeholder="Chercher"
            debounceTimeout={300}
            minLength={2}
            onChange={(e) => setParams({ search: e.target.value })}
            {...props}
        />
        <span className="input-icon-addon">
            <i className="fe fe-search" />
        </span>
    </div>
);
