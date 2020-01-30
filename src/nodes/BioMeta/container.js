import React, {Component} from 'react';
import LineRectComponent from "./LineRectComponent";
import NodeFrame from "../lib/NodeFrame";


export class Container extends Component {

    constructor(props){
        super(props);

    }


    render() {
                return(
                    <NodeFrame isGrid={this.props.isGrid} name={"BioMeta"}>
                            <LineRectComponent/>
                    </NodeFrame>)
    }
}
