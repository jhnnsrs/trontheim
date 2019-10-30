import React, {Component} from 'react';
import './style.css';
import {connectOpera} from "../alta/react";
import {orchestraterEpic} from "./orchestrator";
import {rootStavanger} from "../rootStavanger";
import {landingStavanger} from "./stavanger";
import TrontheimBanner from "./components/TrontheimBanner";

class Landing extends Component {

    render() {
        return (
            <div id="TestList">
                <TrontheimBanner/>
            </div>
        );
    }
}


// dynamic:
export  default connectOpera(landingStavanger)(orchestraterEpic)(Landing)("landing",rootStavanger);
