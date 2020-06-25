import React, { useEffect, useState } from "react";
import Select, { OptionsType, components } from "react-select";
import {
  api,
  PaginatedResponse,
  useBetterQuery,
} from "../../../services/apiService";
import { User } from "../../../models/user";
import { FieldAttributes, useField } from "formik";
import "./select-users.css";

export type SelectUserFieldProps = {
  name: string;
  feedback?: boolean;
  feedbackOnTouchedOnly?: boolean;
} & FieldAttributes<any>;

/**
 * Component responsible for displaying an option in the menu.
 */
const Option = (props) => (
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

/**
 * Inner wrapper for the menu. It directly wraps around the returned options.
 */
const MenuList = (props) => (
  <components.MenuList {...props} className="selectize-dropdown">
    {props.children}
  </components.MenuList>
);

/**
 * Receives the value of the option and is responsible for rendering it to the input.
 */
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

/**
 * The component that displays the selected value in the input for a single select.
 */
const SingleValue = (props) =>
  props.data.value !== "" ? (
    <components.SingleValue {...props}>
      <img
        src={`/profile/${props.data.value}.jpg`}
        alt={`Avatar de ${props.data.value}.`}
        className="mr-1 select-users-value-label-img"
      />
      {props.children}
    </components.SingleValue>
  ) : null;

/**
 * A react-select `Select` component allowing to select an user, tied to a
 * Formik field.
 *
 * The Formik field's value follows the react-select format: an object (or array
 * of objects) `{ value, label }`. This should be taken into account when
 * filling `defaultValues`.
 *
 * @param name the name of the control, given to Formik's `useField`.
 * @param feedback defaults to `true`. If `true`, the input will be given the
 * `isInvalid` props when needed.
 * @param feedbackOnTouchedOnly defaults to `true`. If `true`, the feedback
 * is only displayed if the field is touched.
 * @param isMulti defaults to `false`. If `true`, several users may be selected.
 * @param props passed to `useField` and `Select`.
 */
export const SelectUserField = ({
  name,
  feedback = true,
  feedbackOnTouchedOnly = true,
  isMulti = false,
  ...props
}: SelectUserFieldProps) => {
  const [, { value, touched, error }, { setValue }] = useField({
    name: name,
    ...props,
  });

  // Mirrors the search input. Used to update `data`.
  const [searchInput, setSearchInput] = useState<string | undefined>(undefined);

  // The displayed users.
  const { data } = useBetterQuery<PaginatedResponse<User[]>>(
    [
      "listUsers",
      {
        search: searchInput,
        page_size: 10,
      },
      1,
    ],
    api.users.list,
    {
      refetchOnWindowFocus: false,
    }
  );

  // These hooks convert `data` to the format used by react-select.
  const [usersOptions, setUsersOptions] = useState<
    OptionsType<{ value: string; label: string }>
  >([]);

  useEffect(() => {
    if (data) {
      setUsersOptions(
        data.results.map((user) => ({
          value: user.id,
          label: `${user.firstName} ${user.lastName}`,
        }))
      );
    }
  }, [data]);

  const styles = {
    control: (provided) =>
      feedback && (touched || !feedbackOnTouchedOnly) && !!error
        ? {
            ...provided,
            // These are the CSS properties of the
            // `.form-control .is-invalid` selector.
            // They are copy-pasted because the properties of
            // `form-control` do not integrate well with react-select.
            borderColor: "#cd201f",
            paddingRight: "calc(1.6em + 0.75rem)",
            backgroundImage:
              "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23cd201f' viewBox='-2 -2 7 7'%3e%3cpath stroke='%23cd201f' d='M0 0l3 3m0-3L0 3'/%3e%3ccircle r='.5'/%3e%3ccircle cx='3' r='.5'/%3e%3ccircle cy='3' r='.5'/%3e%3ccircle cx='3' cy='3' r='.5'/%3e%3c/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center right calc(0.4em + 0.1875rem)",
            backgroundSize: "calc(0.8em + 0.375rem) calc(0.8em + 0.375rem)",
          }
        : provided,
  };

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
        SingleValue,
      }}
      onChange={(newValue) => setValue(newValue)}
      onInputChange={(newInput) => setSearchInput(newInput)}
      placeholder="Sélectionner quelqu’un…"
      noOptionsMessage={() => "Aucun résultat"}
      styles={styles}
      {...props}
    />
  );
};
