import React, {Component} from 'react';

import RegExSelector from "./RegExSelector";
import NodeFrame from "../lib/NodeFrame";
import SampleShow from "./SampleShow";


export default class ExperimentAdder extends Component {

    constructor(props){
        super(props);

    }


    render() {
                return(
                    <NodeFrame isGrid={this.props.isGrid} name={"Sample FileName"}>
                            <RegExSelector/>
                            <SampleShow/>
                    </NodeFrame>)
    }
}
