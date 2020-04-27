import React from "react";
import { getRandom } from "../../utils/random";

/**
 * Display a single line emphasizing either the top or the left side of the card. Should be used as a *top* child of the `Card` component.
 *
 * @param color to be chosen between `blue`, `green`, `orange`, `red`, `yellow`, `teal`, `purple` and `random`. Defaults to `blue`.
 * @param position to be chosen between `top` and `left`. Defaults to `top`.
 */
export const CardStatus = ({
    color = "blue",
    position = "top"
}: {
    color?:
        | "blue"
        | "green"
        | "orange"
        | "red"
        | "yellow"
        | "teal"
        | "purple"
        | "random";
    position?: "top" | "left";
}) => (
    <div
        className={`card-status bg-${
            color === "random" ? getRandomColor() : color
        } card-status-${position}`}
    />
);

const getRandomColor = () =>
    getRandom(["blue", "green", "orange", "red", "yellow", "teal", "purple"]);
