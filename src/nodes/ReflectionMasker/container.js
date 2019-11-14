import React, {Component} from 'react';
import NodeFrame from "../lib/NodeFrame";
import ReflectionMaskerComponent from "./ReflectionMaskerComponent";


export class TwoDShow extends Component {

    constructor(props){
        super(props);

    }


    render() {
                return(
                    <NodeFrame isGrid={this.props.isGrid} name={"ReflectionMasker"}>
                            <ReflectionMaskerComponent/>
                    </NodeFrame>)
    }
}
