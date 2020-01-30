import React, {Component} from 'react';

import LineRectComponent from "./LineRectComponent";
import NodeFrame from "../lib/Frames/NodeFrame";


export class MaxISP extends Component {

    constructor(props){
        super(props);

    }


    render() {
                return(
                    <NodeFrame isGrid={this.props.isGrid} name={"SliceLineConverter"}>
                            <LineRectComponent/>
                    </NodeFrame>)
    }
}
