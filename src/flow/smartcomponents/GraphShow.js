import type {BioImageFlowStavanger} from "../stavanger";
import {connectInstrument} from "../../alta/react";
import React from "react"
import {Card, CardBody, Col, Container, Row} from "reactstrap";

import Dict from "../../generics/Dict";
import {STATUSIN, STATUSOUT} from "../../alta/horten/nomogram";

const GraphShow = (props) =>
    <Container>
        <Row>
        <Dict dict={props.graph.nodes}>
            {(node) => {
                let color = node.requiresUser && node.status == STATUSIN ? "#ffbb11" : "#FFFFFF"
                color = node.status == STATUSOUT ? "#d6ffb0": color
                color = node.error ? "#ff002c": color
                return(<Col>
                    <Card
                        style={{backgroundColor: color}}>
                        <CardBody>
                            {node.name}
                            {node.progress && <p>Loading</p>}
                        </CardBody>
                    </Card>
                </Col>)
            }
            }
        </Dict>
        </Row>
    </Container>

const mapStavangerToProps = (stavanger: BioImageFlowStavanger) => ({
    graph: stavanger.graph.selectors.getGraphShow,
});

const mapStavangerToDispatch  = (stavanger: BioImageFlowStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(GraphShow);