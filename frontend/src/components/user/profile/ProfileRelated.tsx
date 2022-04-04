import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { UserAvatar } from "../../utils/avatar/UserAvatar";
import { AvatarList } from "../../utils/avatar/AvatarList";
import { decidePlural } from "../../../utils/format";
import { Profile } from "../../../models/profile";

const mapToUserAvatar = (userList) =>
  userList.map((user) => (
    <UserAvatar
      key={user.id}
      userId={user.id}
      tooltip={`${user.firstName} ${user.lastName}`}
      link={true}
    />
  ));
const hasRoomate = (profile: Profile) =>
  profile.roommate && profile.roommate.length > 0;
const hasMinesParent = (profile: Profile) =>
  profile.minesparent && profile.minesparent.length > 0;
const hasFillot = (profile: Profile) =>
  profile.fillots && profile.fillots.length > 0;
const hasCousinAst = (profile: Profile) =>
  profile.astcousin && profile.astcousin.length > 0;

export const ProfileRelated = ({ profile }: { profile: Profile }) =>
  hasRoomate(profile) ||
  hasMinesParent(profile) ||
  hasFillot(profile) ||
  hasCousinAst(profile) ? (
    <Card>
      <Card.Body className="px-6">
        {hasRoomate(profile) && (
          <>
            <Row className="mb-1">
              <Col md="12">
                <h5 className="font-weight-normal">
                  {decidePlural(profile.roommate.length, "Co", "Cos")}
                </h5>
              </Col>
            </Row>
            <Row className="justify-content-left mb-5">
              <Col md="12">
                <AvatarList>{mapToUserAvatar(profile.roommate)}</AvatarList>
              </Col>
            </Row>
          </>
        )}

        {(hasMinesParent(profile) || hasFillot(profile)) && (
          <>
            <Row className="mb-1">
              {hasMinesParent(profile) && (
                <Col md="6">
                  <h5 className="font-weight-normal">
                    {decidePlural(
                      profile.minesparent.length,
                      "Marrain(e)",
                      "Marrain(e)s"
                    )}
                  </h5>
                </Col>
              )}
              {hasFillot(profile) && (
                <Col md="6">
                  <h5 className="font-weight-normal">
                    {decidePlural(
                      profile.fillots.length,
                      "Fillot(e)",
                      "Fillot(e)s"
                    )}
                  </h5>
                </Col>
              )}
            </Row>

            <Row className="justify-content-left">
              {hasMinesParent(profile) && (
                <Col md="6" className="justify-content-left">
                  <AvatarList>
                    {mapToUserAvatar(profile.minesparent)}
                  </AvatarList>
                </Col>
              )}

              {hasFillot(profile) && (
                <Col md="6" className="justify-content-left">
                  <AvatarList>{mapToUserAvatar(profile.fillots)}</AvatarList>
                </Col>
              )}
            </Row>
          </>
        )}

        {hasCousinAst(profile) && (
          <>
            <Row className="mb-1">
              <Col md="12">
                <h5 className="font-weight-normal">
                  {decidePlural(
                    profile.astcousin.length,
                    "Cousin AST",
                    "Cousins AST"
                  )}
                </h5>
              </Col>
            </Row>
            <Row className="justify-content-left mb-5">
              <Col md="12">
                <AvatarList>{mapToUserAvatar(profile.astcousin)}</AvatarList>
              </Col>
            </Row>
          </>
        )}
      </Card.Body>
    </Card>
  ) : null;
