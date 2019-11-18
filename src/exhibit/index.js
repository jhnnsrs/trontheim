import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Card, CardBody, Col, Container, Row} from "reactstrap";
import {exhibitStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import Transformations from "./smartcomponents/Transformations";
import ExhibitDetailCard from "./smartcomponents/ExhibitDetailCard";
import Rois from "./smartcomponents/Rois";

import ContainerDimensions from "react-container-dimensions";
import FlatCube from "../cube/FlatCube";
import NiftiControls from "../cube/NiftiControls";


export class Experiment extends Component {

    render() {
        return (
            <Container id="exhibit">
                <LoadAfterProfile>
                    <Container>
                        <Row>
                            <Col xs={12}  md={5} lg={3}>
                                <ExhibitDetailCard/>
                                <NiftiControls/>
                            </Col>
                            <Col xs={12}  md={7} lg={9}>
                                <Card className="mt-2">
                                    <CardBody>
                                        <Container>
                                            <ContainerDimensions>
                                                {({height, width})  => <FlatCube height={width} width={width}/>}
                                            </ContainerDimensions>
                                        </Container>
                                    </CardBody>
                                </Card>
                                <Rois/>
                                <Transformations/>
                            </Col>
                        </Row>
                    </Container>
                </LoadAfterProfile>
            </Container>
        );
    }
}


// dynamic:
export  default connectOpera(exhibitStavanger)(orchestraterEpic)(Experiment)("exhibit",rootStavanger);
