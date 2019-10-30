import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {displayFlowStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import FlowComponent from "./smartcomponents/FlowComponent";
import ExhibitCard from "./smartcomponents/ExhibitCard";
import {MainContainer, Sidebar} from "../common/components/HomeRow";
import NodeGridContainer from "../flow/smartcomponents/NodeGridContainer";
import LayoutsCard from "./smartcomponents/LayoutsCard";
import {Container, Row} from "reactstrap";

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
            <Container id="exhibit">
                <LoadAfterProfile>
                    <Container>
                        <Row>
                            <Sidebar>
                                <FlowComponent/>
                                <ExhibitCard/>
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
export  default connectOpera(displayFlowStavanger)(orchestraterEpic)(Bergen)("exhibitflow",rootStavanger);
