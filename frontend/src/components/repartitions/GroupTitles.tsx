import React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import { NewRepartitionResults } from "./NewRepartitionResults";

export const GroupTitles = (groupsnumber) => {
const titles : string[] = [];
for (var i = 0; i<groupsnumber; i++) {
    titles.push("Groupe " + i);
};
  return (titles);
};