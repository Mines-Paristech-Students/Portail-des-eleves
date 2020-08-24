import { Widget } from "./Widget";
import { useWidgetConfig } from "./widgetConfig";
import React from "react";

export const BirthdayWidget = () => {
  return (
    <Widget
      name={"Anniversaires à venir"}
      {...useWidgetConfig("birthday")}
    >
      <p>Coucou</p>
    </Widget>
  );
};
