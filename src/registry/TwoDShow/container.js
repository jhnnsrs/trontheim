import React, {Component} from 'react';
import TwoDShowComponent from "./TwoDShowComponent";
import NonBlockingNodeFrame from "../lib/Frames/NonBlockingNodeFrame";


export class TwoDShow extends Component {

    constructor(props){
        super(props);

    }


    render() {
                return(
                    <NonBlockingNodeFrame isGrid={this.props.isGrid} name={"TwoDShow"}>
                            <TwoDShowComponent/>
                    </NonBlockingNodeFrame>)
    }
}
