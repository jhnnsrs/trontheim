import React, {Component} from 'react';
import RepresentationList from "./RepresentationList";
import SentBioImages from "./SentBioImages";
import NodeFrame from "../lib/Frames/NodeFrame";
import SeperatingLine from "../../generics/SeperatingLine";


export class ImageMutater extends Component {

    constructor(props){
        super(props);

    }


    render() {
                return(
                    <NodeFrame isGrid={this.props.isGrid} name={"LockerIterator"}>
                        <RepresentationList/>
                        <SeperatingLine name={"Sent Images"}/>
                        <SentBioImages/>
                    </NodeFrame>)
    }
}
