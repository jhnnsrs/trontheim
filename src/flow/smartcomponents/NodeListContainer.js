import React, {Component} from "react";
import type {SampleFlowStavanger} from "../stavanger";
import {connectInstrument} from "../../alta/react";
import {NodeTestContainer} from "../../alta/react/Nodes";
import * as _ from 'lodash'


class NodeListContainer extends Component {
    render() {
        console.log("Rerender Test")
        return (
            <div>
                {this.props.nodes.map( node =>
                    <NodeTestContainer node={node} superpath={"nodes"} key={_.uniqueId()}/>
                )}
            </div>
        );
    }
}

const mapStavangerToProps = (stavanger: SampleFlowStavanger) => ({
    nodes: stavanger.nodes.selectors.getComponents,
});

const mapStavangerToDispatch  = (stavanger: SampleFlowStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(NodeListContainer);
