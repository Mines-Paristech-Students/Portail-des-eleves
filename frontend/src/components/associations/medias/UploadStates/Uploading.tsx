import React, { useEffect, useState } from "react";
import { api } from "../../../../services/apiService";
import { Media } from "../../../../models/associations/media";
import Card from "react-bootstrap/Card";
import { ProgressBar } from "react-bootstrap";

// Sub-component used to upload a media
export const FileUpload = ({ media, association, onComplete }) => {
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        // Use effect to submit the media only once
        const upload = api.medias.upload(
            media,
            association,
            (progressEvent) => {
                let { loaded, total } = progressEvent;
                setProgress(Math.round((loaded * 100) / total));
            }
        );

        upload
            .then((res) => {
                let resData: Media = res.data;
                if (resData.description === null) {
                    resData.description = "";
                }
                onComplete(resData, null);
            })
            .catch((err) => {
                onComplete(media, err);
            });
        // Avoid to resubmit the media if one of the props change
        /* eslint-disable */
    }, []);

    return (
        <Card className={"mt-3"}>
            <Card.Header>
                <div
                    className="spinner-border spinner-border-sm mr-2"
                    role="status"
                >
                    <span className="sr-only">Loading...</span>
                </div>
            </Card.Header>
            <ProgressBar now={progress} label={`${progress}%`} />
        </Card>
    );
};
