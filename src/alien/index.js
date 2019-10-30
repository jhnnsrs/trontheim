import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Card, Col, Container, Row} from "reactstrap";
import {alienStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import NodeDetailCard from "./smartcomponents/NodeDetailCard";
import Inputs from "./smartcomponents/Inputs";
import NodeDisplay from "./smartcomponents/NodeDisplay";

export class Experiment extends Component {

    render() {
        console.log("Rerender Major Template")
        return (
            <div id="test">
                <NodeDisplay/>
            </div>
        );
    }
}


// dynamic:
export  default connectOpera(alienStavanger)(orchestraterEpic)(Experiment)("nodepop",rootStavanger);
