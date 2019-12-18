import React, {Component} from 'react';

import ExperimentSelector from "./ExperimentSelector";
import NodeFrame from "../lib/Frames/NodeFrame";


export default class ExperimentAdder extends Component {

    constructor(props){
        super(props);

    }


    render() {
                return(
                    <NodeFrame isGrid={this.props.isGrid} name={"Impulsor"}>
                            <ExperimentSelector/>
                    </NodeFrame>)
    }
}
