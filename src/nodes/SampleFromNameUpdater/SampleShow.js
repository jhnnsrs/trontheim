import {Container} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import type {SampleFromNameUpdaterStavanger} from "./index";

class LineRectComponent extends Component<any,any> {
    render() {
        return (
            <React.Fragment>
                {this.props.sample && <Container>FileNameTo Parse: {this.props.sample.name}</Container>}
             </React.Fragment>
        );
    }
}

const mapStavangerToProps = (stavanger: SampleFromNameUpdaterStavanger) => ({
    sample: stavanger.sample.selectors.getData,
});

const mapStavangerToDispatch  = (stavanger: SampleFromNameUpdaterStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(LineRectComponent);