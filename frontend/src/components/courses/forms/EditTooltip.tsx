import React, { useEffect, useContext, useState } from "react";
import {
  Form,
  Row,
  Col,
  Button,
  Modal,
  Container,
  Card,
  Spinner,
  ListGroup,
  Badge,
  Overlay,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Form as FormModel } from "../../../models/courses/form";
import { PageTitle } from "../../utils/PageTitle";
import { api, useBetterQuery } from "../../../services/apiService";
import { Formik, useFormik, useField, FormikProps } from "formik";
import { ToastContext } from "../../utils/Toast";
import { Question, QuestionCategory } from "../../../models/courses/question";
import { useParams } from "react-router-dom";
import { CardStatus } from "../../utils/CardStatus";
import { TablerColor } from "../../../utils/colors";

interface EditTooltipFunc {
  (index: number): any;
}

export interface EditTooltipOption {
  icon: string;
  onClick: EditTooltipFunc;
  tooltip: string;
}

export const EditTooltip = ({ questionIndex, tooltipOptions }) => {
  return (
    <Col
        className="bg-primary"
        key={"tooltip-"+questionIndex}
    >
      {tooltipOptions.map((option : EditTooltipOption) => (
        <OverlayTrigger
          placement="right"
          overlay={<Tooltip id="tooltip-options">{option.tooltip}</Tooltip>}
        >
          <Row>
            <Button as={Button} onClick={() => option.onClick(questionIndex)}>
              <i className={"fe fe-" + option.icon} />
            </Button>
          </Row>
        </OverlayTrigger>
      ))}
    </Col>
  );
};
