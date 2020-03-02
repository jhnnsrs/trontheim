import React, {Component} from 'react';
import './style.css';
import {rootStavanger} from "../rootStavanger";
import {Col, Container, Row} from "reactstrap";
import {bioSeriesStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";
import {connectOpera} from "../alta/react";
import LoadAfterProfile from "../authentification/LoadAfterProfile";
import SampleList from "./smartcomponents/SampleList";
import BioSeriesDetailCard from "./smartcomponents/BioSeriesDetailCard";
import Converters from "./smartcomponents/Converters";


export class BioSeries extends Component {

    render() {
        return (
            <Container id="bioseries">
                <LoadAfterProfile>
                    <Container>
                        <Row>
                            <Col xs={12}  md={5} lg={3}>
                                <BioSeriesDetailCard/>
                                <Converters/>
                            </Col>
                            <Col xs={12}  md={7} lg={9}>
                                <SampleList/>
                            </Col>
                        </Row>
                    </Container>
                </LoadAfterProfile>
            </Container>
        );
    }
}


// dynamic:
export  default connectOpera(bioSeriesStavanger)(orchestraterEpic)(BioSeries)("bioseries",rootStavanger);
