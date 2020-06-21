import React from "react";
import { Loan, LoanStatus } from "../../../../../models/associations/library";
import Modal from "react-bootstrap/Modal";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { DayPickerInputFormGroup } from "../../../../utils/forms/DayPickerInputFormGroup";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { SelectFormGroup } from "../../../../utils/forms/SelectFormGroup";
import dayjs from "dayjs";
import { decidePlural } from "../../../../../utils/format";
import { LoanStatusBadge } from "./LoanStatusBadge";
import "./edit_loan_modal.css";

/**
 * A short text giving information about the loan.
 */
const LoanSummary = ({ loan }) => {
  return (
    <div>
      La demande a été déposée le {dayjs(loan.requestDate).format("DD/MM/YYYY")}{" "}
      à {dayjs(loan.requestDate).format("HH:mm")}.{" "}
      {loan.status === "PENDING" ? (
        <>
          Elle est <LoanStatusBadge status={loan.status} />.<br />
          {loan.priority !== null ? (
            <span className={loan.priority > 1 ? "font-weight-bold" : ""}>
              {loan.priority === 1
                ? "Aucune demande n’a été déposée avant celle-ci."
                : `${loan.priority - 1} ${decidePlural(
                    loan.priority - 1,
                    "demande a été déposée",
                    "demandes ont été déposées"
                  )} avant celle-ci.`}
            </span>
          ) : null}
        </>
      ) : loan.status === "REJECTED" ? (
        <>
          Elle a été <LoanStatusBadge status={loan.status} />.
        </>
      ) : loan.status === "ACCEPTED" ? (
        <>
          Elle a été <LoanStatusBadge status={loan.status} />.
        </>
      ) : loan.status === "BORROWED" ? (
        <>
          L’objet a été <LoanStatusBadge status={loan.status} />.<br />
          {loan.expectedReturnDate && (
            <>
              La date de retour prévue est le{" "}
              {dayjs(loan.expectedReturnDate).format("DD/MM/YYYY")}.
            </>
          )}
        </>
      ) : loan.status === "RETURNED" ? (
        <>
          L’objet a été <LoanStatusBadge status={loan.status} />.
        </>
      ) : null}
    </div>
  );
};

const selectItems = ([
  "PENDING",
  "REJECTED",
  "ACCEPTED",
  "BORROWED",
  "RETURNED",
] as LoanStatus[]).map((value: LoanStatus) => ({
  value: value,
  children: (
    <span
      className={`selectgroup-button selectgroup-button-loan-status selectgroup-button-icon mr-2 selectgroup-button-${value.toLowerCase()}`}
    >
      <LoanStatusBadge status={value} />
    </span>
  ),
}));

export const EditLoanModal = ({
  show,
  onHide,
  onSubmit,
  loan,
}: {
  show: boolean;
  onHide: () => void;
  onSubmit: (values, { setSubmitting }) => void;
  loan: Loan | null;
}) =>
  loan && (
    <Modal size="lg" show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>
          {loan.user} veut emprunter{" "}
          <span className="font-italic">{loan.loanable.name}</span>
        </Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={{
          status: loan.status,
          loanDate: loan.loanDate || undefined,
          expectedReturnDate: loan.expectedReturnDate || undefined,
          realReturnDate: loan.realReturnDate || undefined,
        }}
        validationSchema={Yup.object({
          status: Yup.string().required("Ce champ est requis"),
          loanDate: Yup.date().notRequired(),
          expectedReturnDate: Yup.date(),
          realReturnDate: Yup.date(),
          /*endDate: Yup.date().when(
          ["endDateEnabled", "startDate"],
          (endDateEnabled, startDate, schema) =>
            endDateEnabled
              ? startDate &&
                schema
                  .required("Veuillez entrer une date au format JJ/MM/YYYY.")
                  .min(
                    startDate,
                    "La date de fin doit être après la date de début."
                  )
              : schema.notRequired()*/
        })}
        onSubmit={onSubmit}
        component={({ values }) => (
          <Form>
            <Modal.Body>
              <Container>
                <Row>
                  <Col xs={12} md={12}>
                    <LoanSummary loan={loan} />
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col xs={12} md={12}>
                    <SelectFormGroup
                      selectType="inline"
                      type="radio"
                      label="Statut"
                      name="status"
                      items={selectItems}
                    />
                    {values.status === "BORROWED" && (
                      <>
                        <DayPickerInputFormGroup
                          name="loanDate"
                          label="Date de prêt"
                        />
                        <DayPickerInputFormGroup
                          name="expectedReturnDate"
                          label="Date de retour prévue"
                        />
                      </>
                    )}
                    {values.status === "RETURNED" && (
                      <DayPickerInputFormGroup
                        name="realReturnDate"
                        label="Date de retour effective"
                      />
                    )}
                  </Col>
                </Row>
              </Container>
            </Modal.Body>

            <Modal.Footer>
              <Button
                className="btn-icon"
                variant="outline-danger"
                onClick={onHide}
              >
                Annuler
              </Button>
              <Button
                className="btn-icon"
                variant="outline-success"
                type="submit"
              >
                Valider
              </Button>
            </Modal.Footer>
          </Form>
        )}
      />
    </Modal>
  );
