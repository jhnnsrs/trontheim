import React, {Component} from 'react';
import RepresentationList from "./RepresentationList";
import NodeFrame from "../lib/NodeFrame";


export class ImageMutater extends Component {

    constructor(props){
        super(props);

    }


    render() {
                return(
                    <NodeFrame isGrid={this.props.isGrid} name={"RepresentationSelector"}>
                            <RepresentationList/>
                    </NodeFrame>)
    }
}
