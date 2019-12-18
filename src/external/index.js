import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Container, Row} from "reactstrap";
import {externalStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import ExternalComponent from "./smartcomponents/ExternalComponent";
import {MainContainer, Sidebar} from "../common/components/HomeRow";
import NodeHost from "./smartcomponents/NodeHost";

export class Bergen extends Component {


    render() {
        console.log("Rerender Major Template")
        return (
            <div id="test">
                <LoadAfterProfile>
                    <NodeHost/>
                </LoadAfterProfile>
            </div>
        );
    }
}


// dynamic:
export  default connectOpera(externalStavanger)(orchestraterEpic)(Bergen)("external",rootStavanger);
