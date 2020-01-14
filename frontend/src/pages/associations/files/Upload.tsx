import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { PageTitle } from "../../../utils/common";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { api } from "../../../services/apiService";

export const AssociationFilesystemUpload = ({ association, ...props }) => {
    let [uploadingFiles, setUploadingFiles] = useState<{}[]>([]);

    const onDrop = useCallback(
        acceptedFiles => {
            for (let k in acceptedFiles) {
                const file = acceptedFiles[k];
                const upload = api.files.upload(file, association);
                setUploadingFiles([
                    ...uploadingFiles,
                    {
                        name: file.name,
                        axios: upload
                    }
                ]);
            }
        },
        [uploadingFiles, association]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop
    });

    // @ts-ignore
    return (
        <>
            <PageTitle>
                <Link
                    to={`/associations/${association.id}/files`}
                    className={"text-primary"}
                >
                    <i className={"fe fe-arrow-left"} />
                </Link>
                Envoie de fichiers
            </PageTitle>
            <div
                {...getRootProps()}
                className={"border border-secondary rounded p-7 mt-4"}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className={"lead text-center m-0"}>
                        Lachez les fichiers ici ...
                    </p>
                ) : (
                    <p className={"lead text-center m-0"}>
                        Glisser-déposez les fichiers sur cette zone ou cliquez
                        dessus pour envoyer un fichier
                    </p>
                )}
            </div>

            {uploadingFiles.map((upload: any, i) => (
                <FileUploadState key={i + upload.name} upload={upload} />
            ))}
        </>
    );
};

enum UploadState {
    Uploading,
    Success,
    Fail
}

const FileUploadState = ({ upload }) => {
    let [state, setState] = useState<UploadState>(UploadState.Uploading);
    let [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    let [progress, setProgress] = useState<number>(0);

    console.log(upload.axios);
    useEffect(() => {
        if (upload.axios.config === undefined) {
            return;
        }
        upload.axios.config.onUploadProgress = progressEvent => {
            setProgress(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
            );
        };
    });
    let icon;
    if (state === UploadState.Uploading) {
        icon = (
            <div
                className="spinner-border spinner-border-sm mr-2"
                role="status"
            >
                <span className="sr-only">Loading...</span>
            </div>
        );
    } else if (state === UploadState.Success) {
        icon = "✅";
    } else {
        icon = "❌";
    }

    upload.axios
        .then(res => {
            setState(UploadState.Success);
        })
        .catch(err => {
            setState(UploadState.Fail);
        });

    let details;
    if (!isCollapsed) {
        if (state === UploadState.Success) {
            details = <Card.Body>Sucessfully loaded</Card.Body>;
        }

        if (state === UploadState.Uploading) {
            details = (
                <div className="progress">
                    <div
                        className="progress-bar"
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    >
                        {progress}%
                    </div>
                </div>
            );
        }
    }

    return (
        <Card className={"mt-3"}>
            <Card.Header>
                {icon} {upload.name}
                <div className={"card-options"}>
                    {isCollapsed ? (
                        <i
                            className="fe fe-chevron-down"
                            onClick={() => setIsCollapsed(false)}
                        />
                    ) : (
                        <i
                            className="fe fe-chevron-up"
                            onClick={() => setIsCollapsed(true)}
                        />
                    )}
                </div>
            </Card.Header>
            {details}
        </Card>
    );
};
