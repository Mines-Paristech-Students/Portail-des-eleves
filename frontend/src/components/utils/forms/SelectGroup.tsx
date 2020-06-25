import React from "react";
import { FieldAttributes } from "formik";
import { SelectGroupItem } from "./SelectGroupItem";

export type SelectGroupProps = {
  name: string;
  items: {
    value: string;
    text?: string;
    icon?: string;
    children?: any;
  }[];
  type: "radio" | "checkbox";
  selectType?: "inline" | "pills" | "vertical";
  className?: string;
} & FieldAttributes<any>;

const getClassName = (selectType: string) => {
  switch (selectType) {
    case "pills":
      return "selectgroup selectgroup-pills";
    case "vertical":
      return "selectgroup selectgroup-vertical w-100";
    case "inline":
    default:
      return "selectgroup";
  }
};

/**
 * This components generates an array of `SelectGroupItem` with the same `name`
 * and `type` and tied to Formik fields, and wrap them in a `.selectgroup`
 * `div.
 *
 * Props `text` and `icon` allow to render it as an icon button or a text
 * button; the rendering may also be completely personalized with `children`.
 * If several of these props are specified, `children` has the priority over
 * `text` and `text` has the priority over `icon`.
 * If none of these props are specified, the button is filled with `value`.
 *
 * @param name the name of the control, given to Formik's `useField`.
 * @param items the items in the group. Each item is an object with keys
 * `value`, `text`, `icon` and `children`. See `SelectGroupItem` to understand
 * how they are used. `className` is passed to the item `input` element.
 * @param type choose between `radio` and `checkbox`. Defaults to `radio`.
 * @param selectType choose between `inline`, `pills`, and `vertical`.
 * Defaults to `inline`.
 * @param props passed to `useField`.
 */
export const SelectGroup = ({
  name,
  items,
  type = "radio",
  selectType = "inline",
  ...props
}: SelectGroupProps) => (
  <div className={getClassName(selectType)}>
    {items.map(({ value, text, icon, children, className }) => (
      <SelectGroupItem
        key={"item-" + value}
        name={name}
        value={value}
        type={type}
        text={text}
        icon={icon}
        className={className}
        {...props}
      >
        {children}
      </SelectGroupItem>
    ))}
  </div>
);
