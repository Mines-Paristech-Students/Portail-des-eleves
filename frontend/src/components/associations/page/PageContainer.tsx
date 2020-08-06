import React from "react";
import { PageTitle } from "../../utils/PageTitle";
import { Link } from "react-router-dom";
import { PageCard } from "./PageCard";
import Container from "react-bootstrap/Container";
import { Association } from "../../../models/associations/association";
import { Page } from "../../../models/associations/page";

/**
 * Display a `PageCard` in a `Container`. The page title is put in a `PageTitle`
 * component above the `Container`. The header of the `PageCard` is not
 * displayed.
 *
 * A `Modifier` button is added if that's relevant.
 *
 * @param association
 * @param page
 * @param date if `true`, the `publicationDate` and `lastUpdateDate` (if
 * different from `publicationDate`) are displayed.
 */
export const PageContainer = ({
  association,
  page,
  date = false,
}: {
  association: Association;
  page: Page;
  date?: boolean;
}) => (
  <Container>
    <div className="d-flex align-items-center">
      <PageTitle>{page.title}</PageTitle>

      {association.myRole?.permissions?.includes("page") && (
        <Link
          to={`/associations/${association.id}/pages/${page.id}/modifier`}
          className={"btn btn-secondary btn-sm float-right ml-auto"}
        >
          Modifier
        </Link>
      )}
    </div>
    <PageCard association={association} page={page} date={date} />
  </Container>
);
