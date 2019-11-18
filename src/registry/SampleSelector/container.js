import React, {Component} from 'react';
import RepresentationList from "./ExperimentList";
import NodeFrame from "../lib/NodeFrame";


export class ImageMutater extends Component {

    constructor(props){
        super(props);

    }


    render() {
                return(
                    <NodeFrame isGrid={this.props.isGrid} name={"DisplaySelector"}>
                            <RepresentationList/>
                    </NodeFrame>)
    }
}
