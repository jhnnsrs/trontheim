import {Container} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import type {SampleFromNameUpdaterStavanger} from "./index";

class ExtractedInformation extends Component<any,any> {
    render() {
        let { extractedInformation } = this.props

        return (
            <React.Fragment>
                { extractedInformation&& <Container>
                    {extractedInformation.experimentalgroup}<br/>
                    {extractedInformation.sample}<br/>
                    {extractedInformation.animal}<br/>
                </Container>}
            </React.Fragment>
        );
    }
}

const mapStavangerToProps = (stavanger: SampleFromNameUpdaterStavanger) => ({
    extractedInformation: stavanger.extractedInformation.selectors.getData

});

const mapStavangerToDispatch  = (stavanger: SampleFromNameUpdaterStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(ExtractedInformation);