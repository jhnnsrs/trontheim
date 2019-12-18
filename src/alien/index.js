import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {alienStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
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
