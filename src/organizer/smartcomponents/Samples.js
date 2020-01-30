import React, {Component} from "react";
import type {OrganizerStavanger} from "../stavanger";
import {Card, CardBody, CardSubtitle, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import {push} from "react-router-redux"
import ButtonToNavigate from "../../generics/ButtonToNavigate";

class Samples extends Component {

    render() {
        const {samples} = this.props;
        if (samples.data) {
            return (
                <React.Fragment>
                {samples.data.map((sample, index) =>
                        <Card className="mt-2" key={sample.data.id} onClick={() => this.props.selectSample(sample)}>
                            <CardBody>
                                <CardTitle>{sample.data.name}</CardTitle>
                                <CardSubtitle>Sample {sample.data.id}</CardSubtitle>
                                <ButtonToNavigate outline size="sm" color={"danger"} to={"/sample/"+sample.data.id}>Open</ButtonToNavigate>
                            </CardBody>

                        </Card>)}
                </React.Fragment>
            );
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: OrganizerStavanger) => ({
    samples: stavanger.samples.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: OrganizerStavanger) =>  ({
    selectSample: (sample) => stavanger.samples.model.selectItem.request(sample),
    push: (location) => push(location)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Samples);
