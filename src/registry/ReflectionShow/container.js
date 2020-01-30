import React, {Component} from 'react';
import NonBlockingNodeFrame from "../lib/Frames/NonBlockingNodeFrame";
import ReflectionShow from "./ReflectionShow";


export class TwoDShow extends Component {

    constructor(props){
        super(props);

    }


    render() {
                return(
                    <NonBlockingNodeFrame isGrid={this.props.isGrid} name={"Nifti-Magic-O-Slice-Machine"}>
                        <ReflectionShow/>
                    </NonBlockingNodeFrame>)
    }
}
