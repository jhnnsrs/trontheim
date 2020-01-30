import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Container, Row} from "reactstrap";
import {sampleFlowStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import {MainContainer, Sidebar} from "../common/components/HomeRow";
import LayoutsCard from "../common/flow/LayoutsCard";
import Registry from "../common/flow/Registry";
import Show from "../common/flow/Show";
import SampleComponent from "./smartcomponents/SampleComponent";
import FlowComponent from "../common/flow/FlowComponent";

export class Bergen extends Component {


    render() {
        console.log("Rerender Major Template")
        return (
            <Container id="test">
                <LoadAfterProfile>
                    <Container>
                        <Row>
                            <Sidebar>
                                <SampleComponent/>
                                <FlowComponent/>
                                <LayoutsCard/>
                                <Show/>
                            </Sidebar>
                            <MainContainer>
                                <Registry/>
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
