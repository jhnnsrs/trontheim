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

const mapStavangerToProps = (stavanger: LockerFlowStavanger) => ({
    graph: stavanger.graph.selectors.getGraphShow,
});

const mapStavangerToDispatch  = (stavanger: LockerFlowStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(GraphShow);