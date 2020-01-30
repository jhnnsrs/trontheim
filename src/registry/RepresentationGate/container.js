import React, {Component} from 'react';
import NodeFrame from "../lib/Frames/NodeFrame";
import SeperatingLine from "../../generics/SeperatingLine";
import GateOpener from "./GateOpener";


export class ImageMutater extends Component {

    constructor(props){
        super(props);

    }


    render() {
                return(
                    <NodeFrame isGrid={this.props.isGrid} name={"LockerIterator"}>
                        <SeperatingLine name={"Gate Control"}/>
                        <GateOpener/>
                    </NodeFrame>)
    }
}
