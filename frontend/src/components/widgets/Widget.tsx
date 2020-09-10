import React from "react";
import { Card } from "react-bootstrap";
import { TablerColor } from "../../utils/colors";

/**
 * Base layout for all widgets, basically wraps the card component
 */
export const Widget = ({
  config,
  setConfig,
  name = "",
  children,
  color = null,
  bodyWrapped = true,
  cardWrapped = true,
  ...props
}: {
  config: any;
  setConfig: (object) => void;
  name?: string;
  cardWrapped?: boolean;
  children: JSX.Element | JSX.Element[] | null;
  color?: TablerColor | null;
  bodyWrapped?: boolean;
}) => {
  const isOpen = config && config.isOpen !== undefined ? config.isOpen : true;

  return cardWrapped ? (
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

      {isOpen && (bodyWrapped ? <Card.Body>{children}</Card.Body> : children)}
    </Card>
  ) : (
    <div {...props}>{children}</div>
  );
};
