import React, {Component} from "react";
import type {ExperimentalGroupStavanger} from "../stavanger";
import {Card, CardBody, CardSubtitle, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
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

const mapStavangerToProps = (stavanger: ExperimentalGroupStavanger) => ({
    samples: stavanger.samples.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: ExperimentalGroupStavanger) =>  ({
    selectSample: (sample) => stavanger.samples.model.selectItem.request(sample),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Samples);
