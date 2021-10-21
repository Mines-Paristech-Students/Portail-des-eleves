import React, { useContext } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { ProfileInfo } from "./ProfileInfo";
import { ProfileAssociations } from "./ProfileAssociations";
import { ProfileAnswers } from "./ProfileAnswers";
import { ProfileRelated } from "./ProfileRelated";
import { api, useBetterQuery } from "../../../services/apiService";
import { Loading } from "../../utils/Loading";
import { Error } from "../../utils/Error";
import { UserContext } from "../../../services/authService";
import { Profile } from "../../../models/profile";

export const UserProfile = ({ match }: { match: any }) => {
  const user = useContext(UserContext);
  const {
    status,
    data: profile,
    error,
  } = useBetterQuery<Profile>(
    ["profile.get", { userId: match.params.userId }],
    api.profile.get
  );

  if (status === "loading") {
    return <Loading className="mt-5" />;
  } else if (status === "error") {
    return <Error detail={error} />;
  } else if (status === "success" && profile) {
    return (
      <Container className="mt-5">
        <Row>
          <Col md="4">
            <ProfileInfo
              profile={profile}
              showEditButton={!!user && profile.id === user.id}
            />
            <ProfileRelated profile={profile} />
          </Col>
          <Col md="8">
            <ProfileAssociations profile={profile} />
            <ProfileAnswers profile={profile} />
          </Col>
        </Row>
      </Container>
    );
  }
};
