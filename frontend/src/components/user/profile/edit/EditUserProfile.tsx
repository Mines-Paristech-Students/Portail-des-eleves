import React, { useContext } from "react";
import { UserContext } from "../../../../services/authService";
import { api, useBetterQuery } from "../../../../services/apiService";
import { Profile, ProfileQuestion } from "../../../../models/profile";
import { Loading } from "../../../utils/Loading";
import { Error } from "../../../utils/Error";
import Container from "react-bootstrap/Container";
import { PageTitle } from "../../../utils/PageTitle";
import { Form, Formik } from "formik";
import Card from "react-bootstrap/Card";
import { TextFormGroup } from "../../../utils/forms/TextFormGroup";
import Button from "react-bootstrap/Button";
import { SelectFormGroup } from "../../../utils/forms/SelectFormGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { queryCache, useMutation } from "react-query";
import { ToastContext } from "../../../utils/Toast";
import { AxiosError } from "axios";
import * as Yup from "yup";
import { SelectUserFormGroup } from "../../../utils/forms/SelectUserFormGroup";
import { ArrowLink } from "../../../utils/ArrowLink";

// The items in the select.
const currentAcademicYearItems = [
  {
    value: "1A",
    text: "1A",
  },
  {
    value: "2A",
    text: "2A",
  },
  {
    value: "GAP YEAR",
    text: "Césure",
  },
  {
    value: "3A",
    text: "3A",
  },
  {
    value: "GRADUATE",
    text: "Alumni",
  },
];

// Useful for data validation.
const currentAcademicYearValues: string[] = [
  "1A",
  "2A",
  "GAP YEAR",
  "3A",
  "GRADUATE",
];

/**
 * Return the form initial values based on `profile` (for the provided answers) and the `questions` (for the answers not yet provided).
 */
const getInitialValues = (profile: Profile, questions: ProfileQuestion[]) => {
  let initialValues: any = {
    nickname: profile.nickname,
    phone: profile.phone,
    room: profile.room,
    cityOfOrigin: profile.cityOfOrigin,
    option: profile.option,
    currentAcademicYear: profile.currentAcademicYear,
    minesparent: [],
    roommate: [],
    astcousin: [],
  };

  profile.profileAnswers.forEach(({ questionId, text }) => {
    initialValues[`question-${questionId}`] = text;
  });

  profile.roommate.forEach(({ id, firstName, lastName }) => {
    initialValues.roommate.push({
      value: id,
      label: `${firstName} ${lastName}`,
    });
  });

  profile.minesparent.forEach(({ id, firstName, lastName }) => {
    initialValues.minesparent.push({
      value: id,
      label: `${firstName} ${lastName}`,
    });
  });

  profile.astcousin.forEach(({ id, firstName, lastName }) => {
    initialValues.astcousin.push({
      value: id,
      label: `${firstName} ${lastName}`,
    });
  });

  // For every question not found in `initialAnswers`, add an empty string.
  questions.forEach(({ id }) => {
    if (!initialValues.hasOwnProperty(`question-${id}`)) {
      initialValues[`question-${id}`] = "";
    }
  });

  return initialValues;
};

/**
 * Transform the Formik values into a data object consumable by the API.
 */
export const getData = (values: { [key: string]: any }) => {
  let data: {
    profileAnswers: {
      question: number;
      text: string;
    }[];
    roommate: string[];
    minesparent: string[];
    astcousin: string[];
  } = {
    profileAnswers: [],
    roommate: [],
    minesparent: [],
    astcousin: [],
  };

  // These keys are kept as-is.
  const noChangeKeys = [
    "nickname",
    "phone",
    "room",
    "cityOfOrigin",
    "option",
    "currentAcademicYear",
  ];

  for (let key of Object.getOwnPropertyNames(values)) {
    // If no roommate is selected, values.roommate will be equal to null, and iterating over it will yield an error.
    if (key === "roommate" && values[key]) {
      for (let option of values[key]) {
        data.roommate.push(option.value);
      }
    } else if (key === "minesparent" && values[key]) {
      for (let option of values[key]) {
        data.minesparent.push(option.value);
      }
    } else if (key === "astcousin" && values[key]) {
      for (let option of values[key]) {
        data.astcousin.push(option.value);
      }
    } else if (noChangeKeys.includes(key)) {
      data[key] = values[key];
    } else if (key.startsWith("question-")) {
      if (values[key] !== "") {
        data.profileAnswers.push({
          question: Number(key.split("-")[1]),
          text: values[key],
        });
      }
    }
  }

  return data;
};

/**
 * A form which allows the user to edit its profile.
 */
export const EditUserProfile = () => {
  const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);
  const user = useContext(UserContext);

  // The profile data.
  const {
    status: profileStatus,
    data: profile,
    error: profileError,
  } = useBetterQuery<Profile>(
    ["profile.get", user ? { userId: user.id } : false],
    api.profile.get
  );

  // The questions data.
  const {
    status: questionsStatus,
    data: questions,
    error: questionsError,
  } = useBetterQuery<ProfileQuestion[]>(
    ["profile.getQuestions"],
    api.profile.getQuestions
  );

  // Mutation for updating the profile data.
  const [update] = useMutation(api.profile.updateGlobal);

  const onSubmit = (values, { setSubmitting }) => {
    update(
      {
        userId: user && user.id,
        data: getData(values),
      },
      {
        onSuccess: () => {
          queryCache.invalidateQueries(["profile.get"]);
          sendSuccessToast("Profil mis à jour.");
        },
        onError: (errorAsUnknown) => {
          const error = errorAsUnknown as AxiosError;
          sendErrorToast(
            `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${
              error.response === undefined
                ? ""
                : "Détails :" + error.response.data.detail
            }`
          );
        },
        onSettled: setSubmitting(false),
      }
    );
  };

  if (profileStatus === "loading" || questionsStatus === "loading") {
    return <Loading className="mt-5" />;
  } else if (profileStatus === "error") {
    return <Error detail={profileError} />;
  } else if (questionsStatus === "error") {
    return <Error detail={questionsError} />;
  } else if (
    profileStatus === "success" &&
    questionsStatus === "success" &&
    profile &&
    questions
  ) {
    return (
      <Container className="mt-5">
        <PageTitle>
          <ArrowLink to={`/profils/${user ? user.id : ""}`} />
          Modifier votre profil
        </PageTitle>

        <Formik
          initialValues={getInitialValues(profile, questions)}
          validationSchema={Yup.object({
            currentAcademicYear: Yup.string()
              .required("Ce champ est requis.")
              .oneOf(currentAcademicYearValues, "Choix invalide."),
          })}
          onSubmit={onSubmit}
        >
          <Form>
            <Card className="text-left">
              <Card.Body>
                <Row>
                  <Col md={12}>
                    <Card.Title>Informations générales</Card.Title>
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col md={{ span: 6 }}>
                    <TextFormGroup
                      label="Surnom"
                      name="nickname"
                      type="text"
                      iconLeft="user"
                    />
                    <TextFormGroup
                      label="Téléphone"
                      name="phone"
                      type="text"
                      iconLeft="phone"
                    />
                    <SelectFormGroup
                      selectType="inline"
                      type="radio"
                      label="Année actuelle"
                      name="currentAcademicYear"
                      items={currentAcademicYearItems}
                    />
                  </Col>
                  <Col md={{ span: 6 }}>
                    <TextFormGroup
                      label="Chambre à la Meuh"
                      name="room"
                      type="text"
                      iconLeft="home"
                    />
                    <TextFormGroup
                      label="Ville d’origine"
                      name="cityOfOrigin"
                      type="text"
                      iconLeft="map-pin"
                    />
                    <TextFormGroup
                      label="Option"
                      name="option"
                      type="text"
                      iconLeft="activity"
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Row>
                  <Col md={12}>
                    <Card.Title>Relations</Card.Title>
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col md={6}>
                    <SelectUserFormGroup name="roommate" label="Cos" isMulti />
                  </Col>

                  <Col md={6}>
                    <SelectUserFormGroup
                      name="minesparent"
                      label="Marrain(e)s"
                      isMulti
                    />
                  </Col>
                  <Col md={6}>
                    <SelectUserFormGroup
                      name="astcousin"
                      label="Cousins AST"
                      isMulti
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Row>
                  <Col md={12}>
                    <Card.Title className="mb-2">
                      Questions et réponses
                    </Card.Title>

                    <p className="text-muted">
                      Les questions sans réponses ne seront pas affichées.
                    </p>
                  </Col>
                </Row>
                <Row className="mt-3">
                  {questions.map(({ id, text }) => (
                    <Col md={{ span: 6 }} key={id}>
                      <TextFormGroup
                        label={text}
                        name={`question-${id}`}
                        type="text"
                      />
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>

            <Container className="mb-5 text-right">
              <Button type="submit" variant="primary">
                Envoyer
              </Button>
            </Container>
          </Form>
        </Formik>
      </Container>
    );
  }
};
