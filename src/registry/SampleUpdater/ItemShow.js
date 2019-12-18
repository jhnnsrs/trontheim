import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import type {SampleUpdaterStavanger} from "./index";

class ItemShow extends Component<any,any> {
    render() {
        return (
            <React.Fragment>
                <div>
                    {this.props.experiment && this.props.experiment.name}
                    {this.props.animal && this.props.animal.name}
                    {this.props.experimentalgroup && this.props.experimentalgroup.name}
                </div>
            </React.Fragment>
        );
    }
}

const mapStavangerToProps = (stavanger: SampleUpdaterStavanger) => ({
    experiment: stavanger.experiment.selectors.getData,
    animal: stavanger.animal.selectors.getData,
    experimentalgroup: stavanger.experimentalgroup.selectors.getData
});

const mapStavangerToDispatch  = (stavanger: SampleUpdaterStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(ItemShow);