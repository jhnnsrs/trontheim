import React, {Component} from 'react';

import ExperimentSelector from "./ExperimentSelector";
import NodeFrame from "../lib/NodeFrame";
import ExtractedInformation from "./ExtractedInformationDisplay";
import SampleShow from "./SampleShow";


export default class ExperimentAdder extends Component {

    constructor(props){
        super(props);

    }


    render() {
                return(
                    <NodeFrame isGrid={this.props.isGrid} name={"Sample FileName"}>
                            <ExperimentSelector/>
                            <SampleShow/>
                            <ExtractedInformation/>
                    </NodeFrame>)
    }
}
