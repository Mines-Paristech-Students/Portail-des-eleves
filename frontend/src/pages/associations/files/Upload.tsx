import React, { useCallback, useContext, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { PageTitle } from "../../../utils/common";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { api } from "../../../services/apiService";
import { useFormik } from "formik";
import { ToastContext, ToastLevel } from "../../../utils/Toast";
import { Button, Form, ProgressBar } from "react-bootstrap";
import { Media } from "../../../models/associations/media";

export const AssociationFilesystemUpload = ({ association, ...props }) => {
    let [uploadingFiles, setUploadingFiles] = useState<{}[]>([]);

    const onDrop = useCallback(
        acceptedFiles => {
            setUploadingFiles([...uploadingFiles, ...acceptedFiles]);
        },
        [uploadingFiles]
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

            {uploadingFiles.map((file: any, i) => (
                <FileUpload
                    key={file.name}
                    file={file}
                    association={association}
                />
            ))}
        </>
    );
};

enum UploadState {
    Uploading,
    Success,
    Fail
}

const FileUpload = ({ file, association }) => {
    let [state, setState] = useState<UploadState>(UploadState.Uploading);
    let [progress, setProgress] = useState<number>(0);
    let [error, setError] = useState<string>("");
    let [uploadedFile, setUploadedFile] = useState<Media | null>(null);

    useEffect(() => {
        const upload = api.files.upload(file, association, progressEvent => {
            let { loaded, total } = progressEvent;
            setProgress(Math.round((loaded * 100) / total));
        });

        upload
            .then(res => {
                setState(UploadState.Success);
                let resData: Media = res.data;
                if (resData.description === null) {
                    resData.description = "";
                }
                setUploadedFile(resData);
            })
            .catch(err => {
                setError(err.message);
                setState(UploadState.Fail);
            });
    }, []);

    let icon;
    let details;

    if (state === UploadState.Uploading) {
        icon = (
            <div
                className="spinner-border spinner-border-sm mr-2"
                role="status"
            >
                <span className="sr-only">Loading...</span>
            </div>
        );

        details = <ProgressBar now={progress} label={`${progress}%`} />;
    } else {
        icon = "❌";
        details = (
            <Card.Body>
                <p className={"text-danger"}>{error}</p>
            </Card.Body>
        );
    }

    if (state == UploadState.Success && uploadedFile) {
        return <FileUploadDone file={uploadedFile} />;
    }

    return (
        <Card className={"mt-3"}>
            <Card.Header>
                {icon} {file.name}
            </Card.Header>
            {details}
        </Card>
    );
};

const FileUploadDone = ({ file }) => {
    let [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const newToast = useContext(ToastContext);

    const formik = useFormik({
        initialValues: file,
        onSubmit: values => {
            newToast({
                message: "Sauvegarde en cours",
                level: ToastLevel.Success
            });
            api.files
                .patch({
                    id: values.id,
                    name: values.name,
                    description: values.description
                })
                .then(res => {
                    newToast({
                        message: "Fichier sauvegardé !",
                        level: ToastLevel.Success
                    });
                })
                .catch(err => {
                    newToast({
                        message: err.message,
                        level: ToastLevel.Error
                    });
                });
        }
    });

    let details;
    if (!isCollapsed) {
        details = (
            <div>
                <textarea
                    id={"description"}
                    name={"description"}
                    className={"form-control border-0"}
                    placeholder={"Description"}
                    onChange={formik.handleChange}
                    value={formik.values.description}
                />
                <Button
                    size="sm"
                    variant="success"
                    style={{
                        position: "absolute",
                        bottom: "10px",
                        right: "10px",
                        width: "100px"
                    }}
                    type="submit"
                >
                    Sauvegarder
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={formik.handleSubmit}>
            <Card className={"mt-3"}>
                <Card.Header>
                    ✅{" "}
                    <Form.Control
                        id="name"
                        name="name"
                        type="text"
                        className={"border-0"}
                        placeholder="Nom du fichier"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                    />
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
                {!isCollapsed ? details : null}
            </Card>
        </form>
    );
};
