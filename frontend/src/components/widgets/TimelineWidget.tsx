import { Widget } from "./Widget";
import { useWidgetConfig } from "./widgetConfig";
import React from "react";
import { api, useBetterQuery } from "../../services/apiService";
import { Loading } from "../utils/Loading";
import { ErrorMessage } from "../utils/ErrorPage";
import "dayjs/locale/fr";
import { Card, Carousel } from "react-bootstrap";
import { Page } from "../../models/associations/page";
import { Media } from "../../models/associations/media";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

type TimelineItem =
  | {
      date: Date;
      type: "NEWS";
      payload: Page;
    }
  | {
      date: Date;
      type: "FILE_UPLOAD";
      payload: {
        count: number;
        associationId: string;
        medias: Media[];
      };
    };

export const TimelineWidget = ({ ...props }) => {
  const { data, error, status } = useBetterQuery<TimelineItem[]>(
    ["subscriptions.timeline.get"],
    api.subscriptions.timeline,
    { refetchOnWindowFocus: false }
  );

  return (
    <Widget
      cardWrapped={false}
      color={null}
      {...useWidgetConfig("timeline")}
      {...props}
    >
      {status === "loading" ? (
        <Loading />
      ) : status === "error" ? (
        <ErrorMessage>`Une erreur est apparue: ${error}`</ErrorMessage>
      ) : status === "success" && data ? (
        data.map(({ date, type, payload }) => (
          <div key={date + "-" + type} className={"mb-4"}>
            {type === "NEWS" ? (
              <TimelineNews news={payload} />
            ) : type === "FILE_UPLOAD" ? (
              <TimelineFileUpload
                // @ts-ignore
                count={payload?.count}
                // @ts-ignore
                associationId={payload?.associationId}
                // @ts-ignore
                medias={payload?.medias}
                date={date}
              />
            ) : (
              <p>Type inconnu: {type}</p>
            )}
          </div>
        ))
      ) : null}
    </Widget>
  );
};

const MAX_NEWS_LENGTH = 500;
const TimelineNews = ({ news }) => (
  <Card>
    <div className={`card-status bg-blue`} />
    <Card.Header>
      <Card.Title>Brève : {news.title}</Card.Title>
    </Card.Header>
    <Card.Body>
      <ReactMarkdown source={news.text.substring(0, MAX_NEWS_LENGTH)} />
      {news.text > MAX_NEWS_LENGTH && (
        <Link to={`/associations/${news.association}/pages`}>
          Lire la suite
        </Link>
      )}
    </Card.Body>
    <Card.Footer>
      Ecrit par{" "}
      {news.authors.map((author) => (
        <span>
          <Link to={`/profils/${author}`}>{author}</Link>,{" "}
        </span>
      ))}
      le {dayjs(news.lastUpdateDate).locale("fr").format("dddd DD MMMM")}
    </Card.Footer>
  </Card>
);

const TimelineFileUpload = ({ count, associationId, medias, date }) => (
  <Card>
    <div className={`card-status bg-green`} />
    <Card.Header>
      <Card.Title>
        {count} nouveaux medias déposés dans {associationId}
      </Card.Title>
    </Card.Header>
    {medias.length > 0 && (
      <Carousel>
        {medias.map((media) => (
          <Carousel.Item>
            <img
              className="d-block m-auto"
              style={{ height: "500px" }}
              src={media.previewLargeUrl}
              alt={media.id}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    )}
    <Card.Footer>
      <Link
        to={`/associations/${associationId}/fichiers#date=${dayjs(date).format(
          "DD-MM-YYYY"
        )}`}
        className="float-right"
      >
        Voir les médias
      </Link>
      Envoyés le le {dayjs(date).locale("fr").format("dddd DD MMMM")}
    </Card.Footer>
  </Card>
);
