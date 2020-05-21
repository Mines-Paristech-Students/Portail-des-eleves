import React, { useState } from "react";
import {
    Card,
    Row,
    Col,
    Button,
} from "react-bootstrap";
import {
    api,
    PaginatedResponse,
    useBetterQuery,
} from "../../../services/apiService";
import { Pagination } from "../../utils/Pagination";
import { Loading } from "../../utils/Loading";
import { Error } from "../../utils/Error";
import { Namespace } from "../../../models/tag";
import { Tag } from "../../utils/tags/Tag";
import { Tag as TagModel } from "../../../models/tag";
import { tablerColors } from "../../../utils/colors";
import { hashCode } from "../../../utils/hashcode";

export const AssociationNamespaceSettings = ({ association }) => {
    const [
        selectedNamespace,
        setSelectedNamespace,
    ] = useState<Namespace | null>(null);

    return (
        <>
            <Card>
                <Card.Header>
                    <Card.Title>Tags</Card.Title>
                </Card.Header>
            </Card>

            {selectedNamespace && (
                <NamespaceTags namespace={selectedNamespace} />
            )}

            <Pagination
                apiKey={[
                    "association.namespaces.list",
                    { association: association.id },
                ]}
                apiMethod={api.namespaces.list}
                render={(namespaces, paginationControl) => (
                    <>
                        <Row>
                            {namespaces.map((namespace) => (
                                <ListNamespaceTags
                                    key={namespace.id}
                                    namespace={namespace}
                                    setSelectedNamespace={setSelectedNamespace}
                                />
                            ))}
                        </Row>
                        {paginationControl}
                    </>
                )}
            />
        </>
    );
};

const ListNamespaceTags = ({ namespace, setSelectedNamespace }) => {
    return (
        <Col md={"4"} xs={"6"}>
            <Card>
                <Card.Body>
                    <span className={"float-right"}>
                        <Button
                            size={"sm"}
                            className={"mr-2"}
                            onClick={() => setSelectedNamespace(namespace)}
                        >
                            Voir
                        </Button>
                        <Button size={"sm"} variant={"danger"}>
                            Supprimer
                        </Button>
                    </span>

                    <Card.Title>{namespace.name}</Card.Title>
                </Card.Body>
            </Card>
        </Col>
    );
};

const NamespaceTags = ({ namespace }) => {
    const { data, status, error } = useBetterQuery<
        PaginatedResponse<TagModel[]>
    >(
        ["namespace.tags.list", { namespace: namespace.id, page_size: 1000 }],
        api.tags.list
    );

    let type = tablerColors[hashCode(namespace.name) % tablerColors.length];

    return (
        <>
            {status === "loading" ? (
                <Loading />
            ) : status === "error" ? (
                <Error detail={error} />
            ) : (
                <Card>
                    <Card.Body>
                        <span className={"mr-2"}>Tags dans {namespace.name} :</span>
                        {(data?.results.length || 0) > 0 ? (
                            data?.results.map((tag) => (
                                <span key={tag.id}>
                                    <Tag type={type} tag={tag.value} />
                                </span>
                            ))
                        ) : (
                            <em className={"text-muted"}>Aucun tag</em>
                        )}
                    </Card.Body>
                </Card>
            )}
        </>
    );
};
