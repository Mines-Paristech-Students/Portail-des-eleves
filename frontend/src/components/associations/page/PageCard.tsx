import React from "react";
import Card from "react-bootstrap/Card";
import { Page } from "../../../models/associations/page";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { Association } from "../../../models/associations/association";
import dayjs from "dayjs";

/**
 * Display the content of a page in a `Card`.
 *
 * @param association
 * @param page
 * @param header if `true`, a header is displayed, with a `Modifier` link if
 * `association.myRole` contains `page`.
 * @param date if `true`, the `publicationDate` and `lastUpdateDate` (if
 * different from `publicationDate`) are displayed.
 */
export const PageCard = ({
  association,
  page,
  header = false,
  date = false,
}: {
  association: Association;
  page: Page;
  header?: boolean;
  date?: boolean;
}) => (
  <Card>
    {header && (
      <Card.Header>
        <Card.Title>{page.title}</Card.Title>

        {association.myRole?.permissions?.includes("page") && (
          <div className="card-options">
            <Link
              to={`/associations/${association.id}/pages/${page.id}/modifier`}
              className={"btn btn-secondary btn-sm"}
            >
              Modifier
            </Link>
          </div>
        )}
      </Card.Header>
    )}
    <Card.Body className={date && header ? "pt-3" : ""}>
      {date && (
        <p className="text-muted mb-4">
          <span
            title={
              page.lastUpdateDate !== page.creationDate
                ? `Dernière modification le ${dayjs(page.lastUpdateDate).format(
                    "DD/MM/YYYY à HH:mm"
                  )}`
                : undefined
            }
          >
            {`Publié le ${dayjs(page.creationDate).format(
              "DD/MM/YYYY à HH:mm"
            )}`}
          </span>
        </p>
      )}

      <ReactMarkdown source={page.text} />
    </Card.Body>
  </Card>
);
