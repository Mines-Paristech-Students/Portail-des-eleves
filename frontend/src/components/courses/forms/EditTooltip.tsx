import React from "react";
import { Row, Col, Button, OverlayTrigger, Tooltip } from "react-bootstrap";

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
    <Col key={"tooltip-" + questionIndex}>
      {tooltipOptions.map((option: EditTooltipOption) => (
        <OverlayTrigger
          placement="right"
          overlay={<Tooltip id="tooltip-options">{option.tooltip}</Tooltip>}
        >
          <Row>
            <Button onClick={() => option.onClick(questionIndex)}>
              <i className={"fe fe-" + option.icon} />
            </Button>
          </Row>
        </OverlayTrigger>
      ))}
    </Col>
  );
};
