import React, {Component} from "react";
import type {SampleStavanger} from "../stavanger";
import {Card, CardBody, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import ButtonToNavigate from "../../generics/ButtonToNavigate";

class Flows extends Component {

    render() {
        const {flows, sample} = this.props;
        if (flows && sample) {
            return (
                <React.Fragment>
                {flows.map(flow =>
                        <Card className="mt-2" key={flow.data.id}>
                            <CardBody>
                                <CardTitle>{flow.data.id}</CardTitle>
                                <ButtonToNavigate size="sm" outline  to={"/samplesflow/"+flow.data.id+ "/sample/" + sample.id}>
                                    {flow.data.name}
                                </ButtonToNavigate>
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

const mapStavangerToProps = (stavanger: SampleStavanger) => ({
    flows: stavanger.sampleflows.selectors.getList,
    sample: stavanger.sample.selectors.getData,
});

const mapStavangerToDispatch  = (stavanger: SampleStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Flows);
