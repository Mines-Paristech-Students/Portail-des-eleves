import React from 'react';
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

type Props = {
    label: string,
    date: Date,
    onChange: (date: Date) => void
};

export function DateForm(props: Props) {
    function handleChange(event: React.FormEvent) {
        const target = event.target as HTMLInputElement;
        const value = Number(target.value);

        switch (target.name) {
            case "day":
                props.onChange(
                    new Date(
                        props.date.getFullYear(),
                        props.date.getMonth(),
                        value
                    )
                );
                return;
            case "month":
                props.onChange(
                    new Date(
                        props.date.getFullYear(),
                        value,
                        props.date.getDate()
                    )
                );
                return;
            case "year":
                props.onChange(
                    new Date(
                        value,
                        props.date.getMonth(),
                        props.date.getDate()
                    )
                );
                return;
        }
    }

    function renderDays() {
        let days = [];

        for (let i = 1; i <= 31; i++) {
            days.push(
                <option key={props.label + "-day-" + i}
                        value={i}>{i}</option>
            )
        }

        return days;
    }

    function renderMonths() {
        return (
            <>
                <option value={1}>Janvier</option>
                <option value={2}>Février</option>
                <option value={3}>Mars</option>
                <option value={4}>Avril</option>
                <option value={5}>Mai</option>
                <option value={6}>Juin</option>
                <option value={7}>Juillet</option>
                <option value={8}>Août</option>
                <option value={9}>Septembre</option>
                <option value={10}>Octobre</option>
                <option value={11}>Novembre</option>
                <option value={12}>Décembre</option>
            </>
        )
    }

    function renderYears() {
        let years = [];

        for (let i = 2019; i <= 2025; i++) {
            years.push(
                <option key={props.label + "-year-" + i}
                        value={i}>{i}</option>
            )
        }

        return years;
    }

    return (
        <Form.Group>
            <Form.Label>{props.label}</Form.Label>

            <Row noGutters>
                <Col lg={3}>
                    <Form.Control className="form-control custom-select"
                                  name="day"
                                  as="select"
                                  value={String(props.date.getDate())}
                                  onChange={handleChange}>
                        {renderDays()}
                    </Form.Control>
                </Col>

                <Col lg={5}>
                    <Form.Control className="form-control custom-select"
                                  name="month"
                                  as="select"
                                  value={String(props.date.getMonth())}
                                  onChange={handleChange}>
                        {renderMonths()}
                    </Form.Control>
                </Col>

                <Col lg={4}>
                    <Form.Control className="form-control custom-select"
                                  name="year"
                                  as="select"
                                  value={String(props.date.getFullYear())}
                                  onChange={handleChange}>
                        {renderYears()}
                    </Form.Control>
                </Col>
            </Row>
        </Form.Group>
    );
}
