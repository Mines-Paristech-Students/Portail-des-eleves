import {
  api,
  PaginatedResponse,
  useBetterQuery,
} from "../../../../services/apiService";
import { Tag as TagModel } from "../../../../models/tag";
import { tablerColors } from "../../../../utils/colors";
import { hashCode } from "../../../../utils/hashcode";
import { Loading } from "../../../utils/Loading";
import { Error } from "../../../utils/Error";
import { Tag } from "../../../utils/tags/Tag";
import React from "react";

export const TagList = ({ namespace }) => {
  const { data, status, error } = useBetterQuery<PaginatedResponse<TagModel[]>>(
    ["namespace.tags.list", { namespace: namespace.id, page_size: 1000 }],
    api.tags.list
  );

  const color = tablerColors[hashCode(namespace.name) % tablerColors.length];

  return (
    <>
      {status === "loading" ? (
        <Loading />
      ) : status === "error" ? (
        <Error detail={error} />
      ) : (data?.results.length || 0) > 0 ? (
        data?.results.map((tag) => (
          <span key={tag.id}>
            <Tag color={color} tag={tag.value} />
          </span>
        ))
      ) : (
        <em className={"text-muted"}>Aucun tag</em>
      )}
    </>
  );
};
