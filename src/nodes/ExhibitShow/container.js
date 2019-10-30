import React, {Component} from 'react';
import NiftiControls from "../../cube/NiftiControls";
import FlatCube from "../../cube/FlatCube";
import NonBlockingNodeFrame from "../lib/NonBlockingNodeFrame";


export class TwoDShow extends Component {

    constructor(props){
        super(props);

    }


    render() {
                return(
                    <NonBlockingNodeFrame isGrid={this.props.isGrid} name={"Nifti-Magic-O-Slice-Machine"}>
                            <FlatCube/>
                            <NiftiControls/>
                    </NonBlockingNodeFrame>)
    }
}
