import React, {Component} from 'react';
import ImageMutaterComponent from "./ImageMutaterComponent";
import NodeFrame from "../lib/NodeFrame";


export class ImageMutater extends Component {

    constructor(props){
        super(props);

    }


    render() {
                return(
                    <NodeFrame isGrid={this.props.isGrid} name={"Transformation Mutater"}>
                            <ImageMutaterComponent/>
                    </NodeFrame>)
    }
}
