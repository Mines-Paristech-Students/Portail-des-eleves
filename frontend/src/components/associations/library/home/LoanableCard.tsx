import React from "react";
import { Loanable } from "../../../../models/associations/library";
import Card from "react-bootstrap/Card";
import { formatNewLines } from "../../../../utils/format";
import { CardStatus } from "../../../utils/CardStatus";
import { TablerColor } from "../../../../utils/colors";
import Button from "react-bootstrap/Button";
import dayjs from "dayjs";

export const LoanableCard = ({ loanable }: { loanable: Loanable }) => {
    const isAvailable = loanable.status === "AVAILABLE";

    return (
        <Card>
            <CardStatus
                color={isAvailable ? TablerColor.Blue : TablerColor.Gray}
            />

            <Card.Header>
                <Card.Title>{loanable.name}</Card.Title>

                <div className="card-options">
                    {isAvailable && (
                        <>
                            {
                                <Button
                                    className="btn-sm"
                                    variant="primary"
                                    onClick={() => window.alert("Emprunt")}
                                >
                                    Emprunter
                                </Button>
                            }
                        </>
                    )}
                </div>
            </Card.Header>

            <Card.Body className="pt-3">
                {!isAvailable && (
                    <p className="text-muted mb-4">
                        Retour attendu avant le{" "}
                        {dayjs(loanable.expectedReturnDate).format(
                            "DD/MM/YYYY"
                        )}
                    </p>
                )}

                <p>{formatNewLines(loanable.description)}</p>
            </Card.Body>
        </Card>
    );
};
