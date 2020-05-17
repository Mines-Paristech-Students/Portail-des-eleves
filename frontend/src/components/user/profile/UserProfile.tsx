import React, { useContext } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { User } from "../../../models/user/user";
import { UserProfileInfo } from "./UserProfileInfo";
import { UserProfileAssociations } from "./UserProfileAssociations";
import { UserProfileEducation } from "./UserProfileEducation";
import { UserProfileAnswers } from "./UserProfileAnswers";
import { UserProfileRelated } from "./UserProfileRelated";
import { api, useBetterQuery } from "../../../services/apiService";
import { Loading } from "../../utils/Loading";
import { Error } from "../../utils/Error";
import { AuthContext } from "../../../services/authService";

export const UserProfile = ({ match }: { match: any }) => {
    const auth = useContext(AuthContext);
    const { status, data: user, error } = useBetterQuery<User>(
        ["user.get", { userId: match.params.userId }],
        api.user.get
    );

    if (status === "loading") {
        return <Loading />;
    } else if (status === "error") {
        return <Error detail={error} />;
    } else if (status === "success" && user) {
        console.log(user);
        return (
            <Container className="mt-5">
                <Row>
                    <Col md="4">
                        <UserProfileInfo
                            user={user}
                            showEditButton={!!auth && user.id === auth.id}
                        />
                        <UserProfileRelated user={user} />
                    </Col>
                    <Col md="8">
                        <UserProfileAssociations user={user} />
                        <UserProfileEducation user={user} />
                        <UserProfileAnswers user={user} />
                    </Col>
                </Row>
            </Container>
        );
    }
};
