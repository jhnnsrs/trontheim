import React, {Component} from 'react';
import NodeFrame from "../lib/NodeFrame";
import DataShowComponent from "./DataShowComponent";


export class TwoDShow extends Component {

    constructor(props){
        super(props);

    }


    render() {
                return(
                    <NodeFrame isGrid={this.props.isGrid} name={"ClusterDataShow"}>
                        <DataShowComponent/>
                    </NodeFrame>)
    }
}
