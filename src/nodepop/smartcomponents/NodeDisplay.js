import React from "react";
import type {NodeTesterStavanger} from "../stavanger";
import {connectInstrument} from "../../alta/react";
import {NodeTestContainer} from "../../alta/react/Nodes";
import {Card} from "reactstrap";


import {Responsive, WidthProvider} from "react-grid-layout";

const ResponsiveReactGridLayout = WidthProvider(Responsive);


class NodesContainer extends React.PureComponent {

    static defaultProps = {
        className: "layout",
        cols: { lg: 8, md: 4, sm: 4, xs: 4, xxs: 4 },
        rowHeight: 30
    };

    constructor(props) {
        super(props);
        this.onBreakpointChange = this.onBreakpointChange.bind(this);
    }

    // We're using the cols coming back from this to calculate where to add new items.
    onBreakpointChange(breakpoint, cols) {
        this.setState({
            breakpoint: breakpoint,
            cols: cols
        });
    }

    render() {
        return (
            <React.Fragment>
                    {this.props.nodes.map( node =>
                        <Card key={node.id}  className="mb-2">
                            <NodeTestContainer node={node} isGrid={true}/>
                        </Card>
                    )}
            </React.Fragment>
        );
    }

}


const mapStavangerToProps = (stavanger: NodeTesterStavanger) => ({
    nodes: stavanger.nodes.selectors.getComponents,
});

const mapStavangerToDispatch  = (stavanger: NodeTesterStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(NodesContainer);
