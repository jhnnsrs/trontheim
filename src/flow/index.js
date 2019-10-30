import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Button, Card, CardBody, Col, Container, Row} from "reactstrap";
import {bioImageFlowStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import FlowsComponent from "./smartcomponents/FlowsComponent";
import NodeGridContainer from "./smartcomponents/NodeGridContainer";
import NodeListContainer from "./smartcomponents/NodeListContainer";
import GraphShow from "./smartcomponents/GraphShow";
import LayoutList from "./smartcomponents/LayoutList";

export class Bergen extends Component {

    constructor() {
        super();
        this.state = {
            grid: false,
        }
        this.changeLayout = this.changeLayout.bind(this)
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
                            <FlowsComponent/>
                            <LayoutList/>
                            <GraphShow/>
                        </Row>
                        <hr className="hr-text" data-content="Flow"/>
                            <NodeGridContainer/>
                    </Container>
                </LoadAfterProfile>
            </Container>
        );
    }
}


// dynamic:
export  default connectOpera(bioImageFlowStavanger)(orchestraterEpic)(Bergen)("flow",rootStavanger);
