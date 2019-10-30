import React, {Component} from "react";
import type {ExperimentStavanger} from "../stavanger";
import {Button, Card, CardBody, CardImg, CardImgOverlay, CardText, CardTitle, Col, Row} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import Octicon, {LightBulb, Plus} from "@githubprimer/octicons-react";
import ExperimentalGroupForm from "./ExperimentalGroupForm";
import {Link} from "react-router-dom";
import ButtonToNavigate from "../../generics/ButtonToNavigate";

class ExperimentDescription extends Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
    }


    toggle() {
        this.props.setModal(!this.props.modalOpen)
    }

    render() {
        const {experiment} = this.props;
        if (!experiment) return ""
        if (experiment.description_long) {
            return (
                <Card className="mt-2 overflow">
                    <CardBody>
                        <CardTitle>
                            <Row>
                                <Col className="col-auto mr-auto">Description</Col>
                                <Col className="col-auto"><ButtonToNavigate outline outside size={"sm"} to={experiment.linked_paper}> PubMed Paper </ButtonToNavigate> </Col>
                            </Row>
                        </CardTitle>
                        <CardText>
                            <small>{experiment.description_long}</small>
                        </CardText>
                    </CardBody>
                </Card>);
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: ExperimentStavanger) => ({
    experiment: stavanger.experiment.selectors.getData,
});

const mapStavangerToDispatch  = (stavanger: ExperimentStavanger) =>  ({


});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(ExperimentDescription);
