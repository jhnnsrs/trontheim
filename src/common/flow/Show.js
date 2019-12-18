import {connectInstrument} from "../../alta/react";
import React from "react"
import {Button, Card, CardBody, Container, Row} from "reactstrap";

import Dict from "../../generics/Dict";
import type {FlowStavanger} from "../../maestros/flowMeastro";

const GraphShow = (props) =>
    <Container>
        <Row>
            <Dict dict={props.graph.nodes}>
                {(node) => {
                    return(
                        <Card key={node.id}
                            style={{backgroundColor: node.color}}>
                            <CardBody>
                                {node.name} {node.type.location == "external" && "External"}
                                {node.status && <p>{node.status.message}</p>}
                            </CardBody>
                        </Card>
                    )
                }
                }
            </Dict>
        </Row>
    </Container>

const mapStavangerToProps = (stavanger: FlowStavanger) => ({
    graph: stavanger.graph.selectors.getGraphShow,
});

const mapStavangerToDispatch  = (stavanger: FlowStavanger) =>  ({
    resend: (alias) => stavanger.graph.model.resend.request(alias)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(GraphShow);