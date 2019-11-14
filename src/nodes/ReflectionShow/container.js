import React, {Component} from 'react';
import NodeFrame from "../lib/NodeFrame";
import ReflectionShowComponent from "./ReflectionShowComponent";


export class TwoDShow extends Component {

    constructor(props){
        super(props);

    }


    render() {
                return(
                    <NodeFrame isGrid={this.props.isGrid} name={"ReflectionShow"}>
                            <ReflectionShowComponent/>
                    </NodeFrame>)
    }
}
