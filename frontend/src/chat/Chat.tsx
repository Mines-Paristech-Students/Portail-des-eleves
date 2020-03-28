import React, { useContext } from "react";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import { CardBody, Row, Col, Button } from "reactstrap";
import { useFormik } from 'formik';

export const Chat = ({ }) => {
    const validate = values => {
        let error = {};
        return error;
    };

    const formik = useFormik({
        initialValues: {
            message: '',
        },
        validate,
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    const inputStyle = {
        div: {
            border: "solid",
            borderRadius: "20px",
        },
        input: {
            width: "100%",
            border: 0,
            outline: 0,
        },
        historyStyle: {
            height: "50%",
            overflow: 'scroll',
        }
    }

    return (
        <Accordion>
            <Card className="mb-0 mr-3 ml-auto w-50 position-fixed fixed-bottom">
                <Card.Header className="bg-primary text-white p-0">
                    <div className="d-flex flex-row justify-content-between w-100">
                    <div className="m-auto">
                        {"General chat"}
                    </div>
                    <div style={{width: "50px"}}>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                        <i className="fe fe-arrow-up"/>
                    </Accordion.Toggle>
                    </div>
                    </div>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                    <div>
                        <Card.Body style={{ height: "200px", padding: 0 }}>
                            <div className="overflow-auto h-100">
                                {"Un blog, anglicisme pouvant être francisé en blogue1,2, carnet Web2 ou cybercarnet2, est un type de site web — ou une partie d'un site web — utilisé pour la publication périodique et régulière d'articles personnels, généralement succincts, rendant compte d'une actualité autour d'un sujet donné ou d'une profession. À la manière d'un journal intime, ces articles ou « billets » sont typiquement datés, signés et présentés dans un ordre antéchronologique, c'est-à-dire du plus récent au plus ancien. Au printemps 2011, on dénombrait au moins 156 millions de blogs et pas moins d'un million de nouveaux articles de blog publiés chaque jour3. On recensait, en 2012, 31 millions de blogs aux États-Unis4 alors que dans le monde on estime à trois millions le nombre de blogs qui naissent chaque mois5. Toutefois, le nombre de blogs inactifs demeure élevé. Rares sont en effet ceux qui affichent une grande longévité et la majorité d'entre eux est abandonnée par leurs auteurs6. Un blogueur a aujourd'hui loisir de mélanger textes, hypertextes et éléments multimédias (image, son, vidéo, applet) dans ses billets ; il peut aussi répondre aux questions des éventuels lecteurs-souscriveurs (littéralement, « écrivant dessous »), car chaque visiteur d'un blog peut laisser des commentaires sur le blog lui-même, ou bien contacter le blogueur par courrier électronique7."}
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            <Row style={inputStyle.div}>
                                <form onSubmit={formik.handleSubmit}>
                                    <Col className="w-75 b-0" >
                                        <input
                                            className="no-border"
                                            style={inputStyle.input}
                                            id="message"
                                            name="message"
                                            type="text"
                                            onChange={formik.handleChange}
                                            value={formik.values.message}
                                        />
                                        {/* Here tou could add emoji */}
                                    </Col>
                                    <Col className="w-15 b-0">
                                        <Button
                                            className="fe fe-arrow-right btn-default active "
                                            style={{ backgroundColor: "white", border: 0, outline: 0 }}
                                        />
                                    </Col>
                                </form>
                            </Row>
                        </Card.Footer>
                    </div>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
};