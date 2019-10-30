import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Button, Card, CardBody, Col, Container, Row} from "reactstrap";
import {sampleFlowStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import FlowComponent from "./smartcomponents/FlowComponent";
import DisplayComponent from "./smartcomponents/SampleComponent";
import {MainContainer, Sidebar} from "../common/components/HomeRow";
import NodeGridContainer from "../flow/smartcomponents/NodeGridContainer";
import LayoutList from "../flow/smartcomponents/LayoutList";
import LayoutsCard from "./smartcomponents/LayoutsCard";

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
export  default connectOpera(sampleFlowStavanger)(orchestraterEpic)(Bergen)("sampleflow",rootStavanger);
