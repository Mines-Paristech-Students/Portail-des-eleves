import { api } from "../../../services/apiService";
import React, { useEffect, useState } from "react";
import { Tag as TagComponent } from "./Tag";
import { Tag } from "../../../models/tag";

export enum TaggableModel {
  Association = "association",
  Loanable = "loanable",
  Media = "media",
  Page = "page",
  Product = "product",
  Role = "role",
}

/**
 * @param model the `TaggableModel` value of the model we want the tag for.
 * @param id the id of the model
 * @param collapsed true if we want the tags to take less space
 * @param props additional props for the React component
 * @constructor
 */
export const TagList = ({
  model,
  instance,
  collapsed = false,
  ...props
}: {
  model: TaggableModel;
  instance: any;
  collapsed?: boolean;
  [key: string]: any;
}) => {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    if (instance.tags) {
      setTags(instance.tags);
    } else {
      api.tags.list({ [model]: instance.id }).then((response) => {
        setTags(response.results);
      });
    }
  }, [instance.tags, instance.id, model]);

  return (
    <div {...props}>
      {tags.map((tag) => (
        <TagComponent
          tag={tag.namespace.name}
          addon={tag.value}
          key={tag.id}
          collapsed={collapsed}
        />
      ))}
    </div>
  );
};
