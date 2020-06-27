import React from "react";
import { getRandom } from "../../utils/random";
import { TablerColor } from "../../utils/colors";

/**
 * Display a single line emphasizing either the top or the left side of the card. Should be used as a *top* child of the `Card` component.
 *
 * @param color a TablerColor or "random". Defaults to `Blue`.
 * @param position to be chosen between `top` and `left`. Defaults to `top`.
 */
export const CardStatus = ({
  color = TablerColor.Blue,
  position = "top",
}: {
  color?: TablerColor | "random";
  position?: "top" | "left";
}) => (
  <div
    className={`card-status bg-${
      color === "random" ? getRandomColor() : color
    } card-status-${position}`}
  />
);

const getRandomColor = () =>
  getRandom([
    TablerColor.Blue,
    TablerColor.Azure,
    TablerColor.Indigo,
    TablerColor.Purple,
    TablerColor.Pink,
    TablerColor.Red,
    TablerColor.Orange,
    TablerColor.Yellow,
    TablerColor.Lime,
    TablerColor.Green,
    TablerColor.Teal,
    TablerColor.Cyan,
    TablerColor.Gray,
    TablerColor.DarkGray,
  ]);
