import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Card, CardBody, CardImg, CardImgOverlay, CardText, CardTitle, Col, Container, Row} from "reactstrap";
import {nodeBuilderStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import NodeForm from "./smartcomponents/NodeForm";
import Nodes from "./smartcomponents/Nodes";


export class NodeBuilder extends Component {

    render() {
        return (
            <Container id="locker">
                <LoadAfterProfile>
                    <Container>
                        <Row>
                            <Col xs={12}  md={5} lg={3}>
                                <Card inverse className="mt-2 overflow">
                                    <CardImg top width="100%" src={"/images/immunohisto.png"}
                                             alt="Card image cap"/>
                                    <CardImgOverlay className="blur">
                                        <CardTitle>Nodes</CardTitle>
                                        <CardText>
                                            <small>Construct your very own Nodes with this Simple Tool, but beware if you are not a master at this </small>
                                        </CardText>
                                        <CardText>
                                        </CardText>
                                    </CardImgOverlay>
                                </Card>
                                <Nodes/>
                            </Col>
                            <Col xs={12}  md={7} lg={9}>
                                <NodeForm/>
                            </Col>
                        </Row>
                    </Container>
                </LoadAfterProfile>
            </Container>
        );
    }
}


// dynamic:
export  default connectOpera(nodeBuilderStavanger)(orchestraterEpic)(NodeBuilder)("nodebuilder",rootStavanger);
