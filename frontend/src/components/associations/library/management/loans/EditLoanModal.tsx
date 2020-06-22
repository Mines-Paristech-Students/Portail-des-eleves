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
import { LoanStatusTag } from "./LoanStatusTag";
import "./edit_loan_modal.css";

/**
 * A short text giving information about the loan.
 */
const LoanSummary = ({ loan }) => {
  return (
    <div>
      Le prêt a été demandé le {dayjs(loan.requestDate).format("DD/MM/YYYY")} à{" "}
      {dayjs(loan.requestDate).format("HH:mm")}.<br />
      {loan.status === "PENDING" ? (
        <>
          Il est <LoanStatusTag status={loan.status} />.{" "}
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
      ) : loan.status === "REJECTED" || loan.status === "BORROWED" ? (
        <>
          Il a été <LoanStatusTag status={loan.status} />.
        </>
      ) : loan.status === "BORROWED" ? (
        <>
          L’objet a été <LoanStatusTag status={loan.status} /> le{" "}
          {dayjs(loan.loanDate).format("DD/MM/YYYY")}.<br />
          {loan.expectedReturnDate && (
            <>
              La date de retour prévue est le{" "}
              {dayjs(loan.expectedReturnDate).format("DD/MM/YYYY")}.{" "}
              {dayjs() > dayjs(loan.expectedReturnDate) && (
                <span className="font-weight-bold">
                  Cette date est dépassée.
                </span>
              )}
            </>
          )}
        </>
      ) : loan.status === "RETURNED" ? (
        <>
          L’objet a été emprunté le {dayjs(loan.loanDate).format("DD/MM/YYYY")}{" "}
          et <LoanStatusTag status={loan.status} /> le{" "}
          {dayjs(loan.realReturnDate).format("DD/MM/YYYY")}.
        </>
      ) : null}
    </div>
  );
};

/**
 * Transform an array of [LoanStatus, text] into an array ready to be used in
 * a `SelectFormGroup`.
 */
const getSelectItems = (values: [LoanStatus, string][]) =>
  values.map(([value, text]) => ({
    value: value,
    children: (
      <span
        className={`selectgroup-button selectgroup-button-${value.toLowerCase()}`}
      >
        {text}
      </span>
    ),
  }));

const selectItems = (status) =>
  getSelectItems(
    status !== "BORROWED" && status !== "RETURNED"
      ? [
          ["PENDING", "En attente"],
          ["REJECTED", "Refusé"],
          ["ACCEPTED", "Accepté"],
          ["BORROWED", "Emprunté"],
        ]
      : [
          ["PENDING", "En attente"],
          ["REJECTED", "Refusé"],
          ["ACCEPTED", "Accepté"],
          ["BORROWED", "Emprunté"],
          ["RETURNED", "Retourné"],
        ]
  );

export const EditLoanModal = ({
  show,
  onHide,
  onSubmit,
  loan,
  hideConfirmMessage = "Voulez-vous vraiment fermer ? Toutes les modifications seront perdues.",
}: {
  show: boolean;
  onHide: () => void;
  onSubmit: (values, { setSubmitting }) => void;
  loan: Loan | null;
  hideConfirmMessage?: string;
}) =>
  loan && (
    <Formik
      initialValues={{
        status: loan.status,
        loanDate: loan.loanDate || undefined,
        expectedReturnDate: loan.expectedReturnDate || undefined,
        realReturnDate: loan.realReturnDate || undefined,
      }}
      validationSchema={Yup.object({
        status: Yup.string().required("Ce champ est requis"),
        loanDate: Yup.date().when(["status"], (status, schema) =>
          status === "BORROWED"
            ? schema.required("Veuillez entrer une date au format JJ/MM/YYYY.")
            : schema.notRequired()
        ),
        expectedReturnDate: Yup.date().when(
          ["status", "loanDate"],
          (status, loanDate, schema) =>
            status === "BORROWED"
              ? loanDate &&
                schema
                  .required("Veuillez entrer une date au format JJ/MM/YYYY")
                  .min(
                    loanDate,
                    "La date de retour prévue doit être après la date de prêt."
                  )
              : schema.notRequired()
        ),
        realReturnDate: Yup.date().when(["status"], (status, schema) =>
          status === "RETURNED"
            ? schema
                .required("Veuillez entrer une date au format JJ/MM/YYYY")
                .min(
                  loan.loanDate,
                  `La date de retour doit être après la date de prêt
${loan.loanDate && "(le " + dayjs(loan.loanDate).format("DD/MM/YYYY") + ")"}.`
                )
            : schema.notRequired()
        ),
      })}
      onSubmit={onSubmit}
      component={({ dirty, values }) => (
        <Modal
          size="lg"
          show={show}
          onHide={() =>
            (!dirty || window.confirm(hideConfirmMessage)) && onHide()
          }
        >
          <Modal.Header>
            <Modal.Title>
              {loan.user} veut emprunter{" "}
              <span className="font-italic">{loan.loanable.name}</span>
            </Modal.Title>
          </Modal.Header>
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
                      selectType="pills"
                      type="radio"
                      label="Statut"
                      name="status"
                      items={selectItems(loan.status)}
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
                onClick={() =>
                  (!dirty || window.confirm(hideConfirmMessage)) && onHide()
                }
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
        </Modal>
      )}
    />
  );
