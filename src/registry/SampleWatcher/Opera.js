import React, {Component} from 'react';
import StartButton from "./StartButton";
import NodeFrame from "../lib/Frames/NodeFrame";


class Opera extends Component {



    render() {
                return(
                    <NodeFrame name={"LockerWatcher"}>
                            <StartButton/>
                    </NodeFrame>)
    }
}

export default Opera