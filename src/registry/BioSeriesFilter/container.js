import React, {Component} from 'react';
import NodeFrame from "../lib/Frames/NodeFrame";
import FilterOptions from "./FilterOptions";


export class ImageMutater extends Component {

    constructor(props){
        super(props);

    }


    render() {
                return(
                    <NodeFrame isGrid={this.props.isGrid} name={"DisplaySelector"}>
                        <FilterOptions/>
                    </NodeFrame>)
    }
}
