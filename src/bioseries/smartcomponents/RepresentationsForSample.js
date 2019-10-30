import React, {Component} from "react";
import type {BioSeriesStavanger} from "../stavanger";
import {Button, ButtonGroup, Card, CardImg, CardImgOverlay, CardText, CardTitle, Col, Container, Row} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import ButtonToNavigate from "../../generics/ButtonToNavigate";

class RepresentationsForSample extends Component {

    render() {
        const {representations, flows} = this.props;
        const {sample} = this.props.ownProps;
        if (representations.data) {
            return (
                <React.Fragment>
                    {representations.data.filter(item => item.data.sample == sample.data.id).map( (representation, key) =>
                        <Row className="mt-2"  key={key}>
                            <ButtonGroup>
                                <ButtonToNavigate to={"/representation/"+representation.data.id}> {representation.data.name}</ButtonToNavigate>
                                { flows.data.map( (flow,key) =>
                                    <ButtonToNavigate key={key} size="sm" outline to={"/representationflow/"+flow.data.id+ "/representation/" + representation.data.id}>
                                        {flow.data.name}
                                    </ButtonToNavigate>
                                )}
                            </ButtonGroup>
                        </Row>)
                    }
                </React.Fragment>);
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: BioSeriesStavanger) => ({
    representations: stavanger.representations.selectors.getModel,
    flows: stavanger.representationflows.selectors.getModel,
    ownProps: stavanger.representations.selectors.getProps
});

const mapStavangerToDispatch  = (stavanger: BioSeriesStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(RepresentationsForSample);
