import React, {Component} from 'react';
import RoiList from "./RoiList";
import NodeFrame from "../lib/NodeFrame";


export class ImageMutater extends Component {

    constructor(props){
        super(props);

    }


    render() {
                return(
                    <NodeFrame isGrid={this.props.isGrid} name={"RoiSelector"}>
                            <RoiList/>
                    </NodeFrame>)
    }
}
