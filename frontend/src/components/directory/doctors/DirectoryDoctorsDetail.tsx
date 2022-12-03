import React from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Doctor } from "../../../models/directory/doctor";
import { api, useBetterQuery } from "../../../services/apiService";
import { ArrowLink } from "../../utils/ArrowLink";
import { ErrorMessage } from "../../utils/ErrorPage";
import { Loading } from "../../utils/Loading";
import { PageTitle } from "../../utils/PageTitle";
import { TaggableModel, TagList } from "../../utils/tags/TagList";
import { DirectoryLayout } from "../DirectoryLayout";

export const DirectoryDoctorsDetail = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const { data: doctor, status, error } = useBetterQuery<Doctor>(
    ["api.directory.doctors.get", doctorId],
    api.directory.doctors.get
  );

  return (
    <DirectoryLayout>
      {status === "loading" ? (
        <Loading className="mt-4" />
      ) : status === "error" ? (
        <ErrorMessage>{`Une erreur est survenue: ${error}`}</ErrorMessage>
      ) : doctor ? (
        <Container>
          <PageTitle>
            <ArrowLink to="/annuaire/medecins" />
            {doctor.name}
          </PageTitle>

          <TagList
            model={TaggableModel.Doctor}
            instance={doctor}
            className={"my-2"}
          />
        </Container>
      ) : (
        <></>
      )}
    </DirectoryLayout>
  );
};
