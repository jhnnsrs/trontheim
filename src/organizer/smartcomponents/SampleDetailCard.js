import React, {Component} from "react";
import type {OrganizerStavanger} from "../stavanger";
import {Button, Card, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";

class SampleDetailCard extends Component {

    render() {
        const {sample} = this.props;
        if (sample.data) {
            return (
                <Card className="mt-2">
                        <CardTitle>{sample.data.name}</CardTitle>
                        <CardText>
                        </CardText>
                </Card>);
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: OrganizerStavanger) => ({
    sample: stavanger.selectedSample.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: OrganizerStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(SampleDetailCard);
