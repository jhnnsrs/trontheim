import React, {Component} from 'react';
import NodeFrame from "../lib/Frames/NodeFrame";
import BioSeriesList from "./BioSeriesList";


class Opera extends Component {



    render() {
                return(
                    <NodeFrame name={"BioSeriesCollector"} isGrid={this.props.isGrid}>
                            <BioSeriesList/>
                    </NodeFrame>)
    }
}

export default Opera