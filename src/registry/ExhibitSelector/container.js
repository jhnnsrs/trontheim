import React, {Component} from 'react';
import RepresentationList from "./ExhibitList";
import NodeFrame from "../lib/Frames/NodeFrame";
import SelectionShower from "./SelectionShower";


export class ImageMutater extends Component {

    constructor(props){
        super(props);

    }


    render() {
                return(
                    <NodeFrame isGrid={this.props.isGrid} name={"DisplaySelector"}>
                        <SelectionShower/>
                        <RepresentationList/>
                    </NodeFrame>)
    }
}
