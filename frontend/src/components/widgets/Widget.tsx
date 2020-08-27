import React from "react";
import { Card } from "react-bootstrap";
import { TablerColor } from "../../utils/colors";

export const Widget = ({
  config,
  setConfig,
  name,
  children,
  color = null,
  ...props
}: {
  config: any,
  setConfig:  (object) => void,
  name: string,
  children: JSX.Element,
  color?: TablerColor | null
}) => {
  const isOpen = config && config.isOpen !== undefined ? config.isOpen : true;

  return (
    <Card {...props}>
      {color && <div className={`card-status bg-${color}`} />}
      <Card.Header>
        <Card.Title>{name}</Card.Title>
        <div className="card-options">
          {isOpen && (
            <i
              className="fe fe-chevron-up"
              onClick={() => setConfig({ ...config, isOpen: false })}
            />
          )}
          {!isOpen && (
            <i
              className="fe fe-chevron-down"
              onClick={() => setConfig({ ...config, isOpen: true })}
            />
          )}
        </div>
      </Card.Header>
      {isOpen && <Card.Body>{children}</Card.Body>}
    </Card>
  );
};
