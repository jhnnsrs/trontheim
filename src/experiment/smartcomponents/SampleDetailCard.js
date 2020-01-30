import React, {Component} from "react";
import type {ExperimentStavanger} from "../stavanger";
import {Card, CardText, CardTitle} from "reactstrap";
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

const mapStavangerToProps = (stavanger: ExperimentStavanger) => ({
    sample: stavanger.selectedSample.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: ExperimentStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(SampleDetailCard);
