import React, {Component} from 'react';

import ExperimentSelector from "./ExperimentSelector";
import ItemShow from "./ItemShow";
import NodeFrame from "../lib/Frames/NodeFrame";


export default class ExperimentAdder extends Component {

    constructor(props){
        super(props);

    }


    render() {
                return(
                    <NodeFrame isGrid={this.props.isGrid} name={"Experiment Adder"}>
                            <ItemShow/>
                    </NodeFrame>)
    }
}
