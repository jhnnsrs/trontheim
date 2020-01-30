import React, {Component} from 'react';
import StartButton from "./StartButton";
import NodeFrame from "../lib/NodeFrame";


class Opera extends Component {



    render() {
                return(
                    <NodeFrame name={"BioImageWatcher"} isGrid={this.props.isGrid}>
                            <StartButton/>
                    </NodeFrame>)
    }
}

export default Opera