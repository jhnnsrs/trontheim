import React, {Component} from "react";
import type {RepresentationStavanger} from "../stavanger";
import {Button, ButtonGroup, Card, CardImg, CardImgOverlay, CardText, CardTitle, Col, Container, Row} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import ButtonToNavigate from "../../generics/ButtonToNavigate";

class RoisForDisplay extends Component {

    render() {
        const { rois, flows} = this.props;
        const {display} = this.props.ownProps;
        if (rois.data) {
            return (
                <React.Fragment>
                    {rois.data.filter(item => item.data.representation == display.data.representation).map( (roi, key) =>
                        <Row className="mt-2"  key={key}>
                            <ButtonGroup>
                                <ButtonToNavigate to={"/roi/"+roi.data.id}> {roi.data.id}</ButtonToNavigate>
                                { flows.data.map( (flow,key) =>
                                    <ButtonToNavigate key={key} size="sm" outline to={"/roiflow/"+flow.data.id+ "/roi/" + roi.data.id}>
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

const mapStavangerToProps = (stavanger: RepresentationStavanger) => ({
    rois: stavanger.rois.selectors.getModel,
    flows: stavanger.roiflows.selectors.getModel,
    ownProps: stavanger.rois.selectors.getProps
});

const mapStavangerToDispatch  = (stavanger: RepresentationStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(RoisForDisplay);
