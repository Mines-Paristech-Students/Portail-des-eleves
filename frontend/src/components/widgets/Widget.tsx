import React from "react";
import { Card } from "react-bootstrap";

export const Widget = ({ config, setConfig, name, children }) => {
  const isOpen = config && config.isOpen !== undefined ? config.isOpen : true;

  return (
    <Card>
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
