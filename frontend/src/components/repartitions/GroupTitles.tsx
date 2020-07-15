import React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import { NewRepartitionResults } from "./NewRepartitionResults";

export const GroupTitles = (groupsNumber) => {
  const titles: string[] = [];
  for (var i = 0; i < groupsNumber; i++) {
    titles.push("Groupe " + i);
  }
  return titles;
};
