import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Button, Card, CardBody, Col, Container, Row} from "reactstrap";
import {bioimageFlowStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import DisplayComponent from "./smartcomponents/BioImageComponent";
import {MainContainer, Sidebar} from "../common/components/HomeRow";
import NodeGridContainer from "../flow/smartcomponents/NodeGridContainer";
import LayoutsCard from "../sampleflow/smartcomponents/LayoutsCard";
import FlowComponent from "../sampleflow/smartcomponents/FlowComponent";

export class Bergen extends Component {


    constructor() {
        super();
        this.state = {
            grid: false,
        }
    }

    changeLayout() {
        this.setState({grid: !this.state.grid})
    }

    render() {
        console.log("Rerender Major Template")
        return (
            <Container id="test">
                <LoadAfterProfile>
                    <Container>
                        <Row>
                            <Sidebar>
                                <FlowComponent/>
                                <DisplayComponent/>
                                <LayoutsCard/>
                            </Sidebar>
                            <MainContainer>
                                <NodeGridContainer/>
                            </MainContainer>
                        </Row>
                    </Container>
                </LoadAfterProfile>
            </Container>
        );
    }
}


// dynamic:
export  default connectOpera(bioimageFlowStavanger)(orchestraterEpic)(Bergen)("bioimageflow",rootStavanger);
