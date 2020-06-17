import React from "react";
import { Link, useParams } from "react-router-dom";
import { api, useBetterQuery } from "../../../services/apiService";
import { PageTitle } from "../../utils/PageTitle";
import Card from "react-bootstrap/Card";
import { Media } from "../../../models/associations/media";
import { TaggableModel, TagList } from "../../utils/tags/TagList";
import { Loading } from "../../utils/Loading";
import { ErrorMessage } from "../../utils/ErrorPage";
import { formatDate, formatTime } from "../../../utils/format";
import { isImageMime } from "../../../utils/mime";

export const AssociationFilesystemDetail = ({ association }) => {
  const { fileId } = useParams<{ fileId: string }>();
  const { data: media, status, error } = useBetterQuery<Media>(
    ["media.get", fileId],
    api.medias.get
  );

  return status === "loading" ? (
    <Loading />
  ) : status === "error" ? (
    <ErrorMessage>{`Une erreur est survenue: ${error}`}</ErrorMessage>
  ) : media ? (
    <div>
      {association.myRole.permissions?.includes("media") && (
        <div className={"float-right mt-2"}>
          <a
            href={media.url}
            download
            className={"btn btn-sm btn-success mr-2"}
          >
            <span className="fe fe-download" /> Télécharger
          </a>
          <Link
            to={`/associations/${association.id}/fichiers/${media.id}/modifier`}
            className={"btn btn-primary btn-sm"}
          >
            <span className="fe fe-edit-2" /> Editer
          </Link>
        </div>
      )}
      <PageTitle>
        <Link
          to={`/associations/${association.id}/fichiers`}
          className={"text-primary"}
        >
          <i className={"fe fe-arrow-left"} />
        </Link>
        {media.name}
      </PageTitle>

      {isImageMime(media.mimetype) && (
        <img src={media.url} alt={media.name} className={"rounded mt-3"} />
      )}

      <TagList
        model={TaggableModel.Media}
        instance={media}
        className={"my-2"}
      />

      <Card>
        <Card.Body>
          {media.description && media.description.length > 0 ? (
            media.description
          ) : (
            <em>Aucune description</em>
          )}
        </Card.Body>
        <Card.Footer>
          Mis en ligne le {formatDate(media.uploadedOn)} à{" "}
          {formatTime(media.uploadedOn)}
        </Card.Footer>
      </Card>
    </div>
  ) : null;
};
