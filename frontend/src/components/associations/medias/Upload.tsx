import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { PageTitle } from "../../utils/PageTitle";
import { api } from "../../../services/apiService";
import { TagAdder } from "../../utils/tags/TagAdder";
import { AxiosError } from "axios";
import { Tag } from "../../../models/tag";
import { FileUploadSuccess } from "./UploadStates/Success";
import { FileUploadError } from "./UploadStates/Error";
import { FileUpload } from "./UploadStates/Uploading";
import { Association } from "../../../models/associations/association";
import { Media } from "../../../models/associations/media";
import { ArrowLink } from "../../utils/ArrowLink";

enum UploadState {
  Uploading,
  Success,
  Fail,
}

export const AssociationFilesystemUpload = ({ association }) => (
  <>
    <PageTitle>
      <ArrowLink to={`/associations/${association.id}/fichiers`} />
      Envoi de fichiers
    </PageTitle>
    <UploadForm association={association} />
  </>
);

/**
 * @param association the association to which the uploaded files should be
 * linked
 * @param onMediaUpload a callback for when a new media is successfully uploaded
 */
export const UploadForm = ({
  association,
  onMediaUpload = () => {},
}: {
  association: Association;
  onMediaUpload?: (media: Media) => void;
}) => {
  // Subcomponents that will be used to upload the medias
  const [medias, setMedias] = useState<
    { media: any; status: UploadState; error: AxiosError | null }[]
  >([]);

  const [tagsToBind, setTagsToBind] = useState<Tag[]>([]);

  // Create and handle drop zone
  const onDrop = (mediasToAdd) => {
    setMedias((medias) => [
      ...medias,
      ...mediasToAdd.map((media) => ({
        media: media,
        status: UploadState.Uploading,
        error: null,
      })),
    ]);
  };

  const markAsCompleted = (i, media, error) => {
    let newUploadingFiles = [...medias];

    if (error !== null) {
      newUploadingFiles[i].error = error;
      setMedias(newUploadingFiles);
      return;
    }

    // Ih there is no that, mark it as done immediately
    if (tagsToBind.length === 0) {
      newUploadingFiles[i].media = media;
      newUploadingFiles[i].status = UploadState.Success;
      setMedias(newUploadingFiles);
      onMediaUpload(media);
    }

    // Bind the created object to all necessary tags and THEN mark it
    // as done
    Promise.allSettled(
      tagsToBind.map((tag) => api.tags.bind("media", media.id, tag.id))
    )
      .then((_) => {
        newUploadingFiles[i].media = media;
        newUploadingFiles[i].status = UploadState.Success;
        onMediaUpload(media);
      })
      .catch((error) => {
        newUploadingFiles[i].error = error;
        newUploadingFiles[i].status = UploadState.Fail;
      })
      .finally(() => setMedias(newUploadingFiles));
  };

  const deleteMedia = (media) => {
    api.medias.delete(media).then((_) => {
      setMedias(medias.filter((m) => m.media.id !== media));
    });
  };

  return (
    <>
      <div className="py-2">
        <p className="lead">Etape 1</p>
        <TagAdder
          parent={"association"}
          parentId={association.id}
          onChange={setTagsToBind}
        />
      </div>
      <div className="py-2">
        <p className="lead">Etape 2</p>
        <Dropzone onDrop={onDrop}>
          {({ getInputProps, getRootProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className={"border border-secondary rounded p-7 mt-4"}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className={"lead text-center m-0"}>
                  Déposez les fichiers ici ...
                </p>
              ) : (
                <p className={"lead text-center m-0"}>
                  Glisser-déposez les fichiers sur cette zone ou cliquez dessus
                  pour envoyer un fichier
                </p>
              )}
            </div>
          )}
        </Dropzone>
      </div>

      {medias.map(({ media, status, error }, i) =>
        status === UploadState.Success ? (
          <FileUploadSuccess
            media={media}
            key={i}
            onDelete={() => deleteMedia(media)}
          />
        ) : status === UploadState.Fail ? (
          <FileUploadError media={media} error={error} key={i} />
        ) : (
          <FileUpload
            key={i}
            media={media}
            association={association}
            onComplete={(newFile, status) =>
              markAsCompleted(i, newFile, status)
            }
          />
        )
      )}
    </>
  );
};
