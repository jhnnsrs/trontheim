import React, {Component} from 'react';
import NodeFrame from "../lib/NodeFrame";
import FilterOptions from "./FilterOptions";


class Opera extends Component {



    render() {
                return(
                    <NodeFrame name={"BioSeriesFilter"} isGrid={this.props.isGrid}>
                            <FilterOptions/>
                    </NodeFrame>)
    }
}

export default Opera