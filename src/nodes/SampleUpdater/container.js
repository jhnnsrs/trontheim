import React, {Component} from 'react';

import ExperimentSelector from "./ExperimentSelector";
import NodeFrame from "../lib/NodeFrame";
import ItemShow from "./ItemShow";


export default class ExperimentAdder extends Component {

    constructor(props){
        super(props);

    }


    render() {
                return(
                    <NodeFrame isGrid={this.props.isGrid} name={"Experiment Adder"}>
                            <ExperimentSelector/>
                            <ItemShow/>
                    </NodeFrame>)
    }
}
