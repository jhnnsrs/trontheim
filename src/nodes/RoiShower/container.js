import React, {Component} from 'react';
import TwoDShowComponent from "./TwoDShowComponent";
import NonBlockingNodeFrame from "../lib/NonBlockingNodeFrame";


export class TwoDShow extends Component {

    constructor(props){
        super(props);

    }


    render() {
                return(
                    <NonBlockingNodeFrame isGrid={this.props.isGrid} name={"RoiShower"}>
                            <TwoDShowComponent/>
                    </NonBlockingNodeFrame>)
    }
}
