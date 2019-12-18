import React, {Component} from "react";
import type {BioImageStavanger} from "../stavanger";
import {ButtonGroup, Row} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import ButtonToNavigate from "../../generics/ButtonToNavigate";

class SamplesForBioSeries extends Component {

    render() {
        const {samples, flows} = this.props;
        const {bioseries} = this.props.ownProps;
        if (bioseries.data) {
            return (
                <React.Fragment>
                    <h3>Samples</h3>
                    {samples.data.filter(item => item.data.bioseries == bioseries.data.id).map( (sample, key) =>
                        <Row className="mt-2"  key={key}>
                            <ButtonGroup>
                                <ButtonToNavigate to={"/sample/"+sample.data.id}> {sample.data.name}</ButtonToNavigate>
                                { flows.data.map( (flow,key) =>
                                    <ButtonToNavigate key={key} size="sm" outline to={"/samplesflow/"+flow.data.id+ "/sample/" + sample.data.id}>
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

const mapStavangerToProps = (stavanger: BioImageStavanger) => ({
    samples: stavanger.samples.selectors.getModel,
    flows: stavanger.sampleflows.selectors.getModel,
    ownProps: stavanger.samples.selectors.getProps
});

const mapStavangerToDispatch  = (stavanger: BioImageStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(SamplesForBioSeries);
