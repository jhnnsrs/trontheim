import React, {Component} from 'react';
import NodeFrame from "../lib/NodeFrame";
import BioSeriesList from "./BioSeriesList";


class Opera extends Component {



    render() {
                return(
                    <NodeFrame name={"Transformation Collector"} isGrid={this.props.isGrid}>
                            <BioSeriesList/>
                    </NodeFrame>)
    }
}

export default Opera