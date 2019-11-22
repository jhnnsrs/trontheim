import {connectInstrument} from "../../alta/react";
import React from "react"
import {Card, CardBody, Container, Row} from "reactstrap";

import Dict from "../../generics/Dict";
import type {FlowStavanger} from "../../maestros/flowMeastro";

const GraphShow = (props) =>
    <Container>
        <Row>
            <Dict dict={props.graph.nodes}>
                {(node) => {
                    return(
                        <Card key={node.id}
                            style={{backgroundColor: "#ffFFff"}}>
                            <CardBody>
                                {node.name}
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
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(GraphShow);