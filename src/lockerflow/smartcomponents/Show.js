import type {LockerFlowStavanger} from "../stavanger";
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
                    return(<Col>
                        <Card
                            style={{backgroundColor: "#ffffff"}}>
                            <CardBody>
                                {node.name}
                                {node.status && <p>{node.status}</p>}
                            </CardBody>
                        </Card>
                    </Col>)
                }
                }
            </Dict>
        </Row>
    </Container>

const mapStavangerToProps = (stavanger: LockerFlowStavanger) => ({
    graph: stavanger.graph.selectors.getGraphShow,
});

const mapStavangerToDispatch  = (stavanger: LockerFlowStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(GraphShow);