import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Container, Row} from "reactstrap";
import {bioImageFlowStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import FlowComponent from "../common/flow/FlowComponent";
import {MainContainer, Sidebar} from "../common/components/HomeRow";
import LayoutsCard from "../common/flow/LayoutsCard";
import Registry from "../common/flow/Registry";
import Show from "../common/flow/Show";
import BioImageComponent from "./smartcomponents/BioImageComponent";

export class Bergen extends Component {


    render() {
        console.log("Rerender Major Template")
        return (
            <Container id="test">
                <LoadAfterProfile>
                    <Container>
                        <Row>
                            <Sidebar>
                                <FlowComponent/>
                                <BioImageComponent/>
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
export  default connectOpera(bioImageFlowStavanger)(orchestraterEpic)(Bergen)("bioimageflow",rootStavanger);
