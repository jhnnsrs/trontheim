import React from "react";
import type {BioImageFlowStavanger} from "../stavanger";
import {connectInstrument} from "../../alta/react";
import {NodeContainer} from "../../alta/react/Nodes";
import {Card} from "reactstrap";


import {Responsive, WidthProvider} from "react-grid-layout";

const ResponsiveReactGridLayout = WidthProvider(Responsive);


class NodesContainer extends React.PureComponent {

    static defaultProps = {
        className: "layout",
        cols: { lg: 4, md: 4, sm: 4, xs: 4, xxs: 4 },
        rowHeight: 50
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
        let {nodes} = this.props

        return (
            <Card body style={{ borderColor: '#FFFFFF' }} className={"mt-2"}>
                <ResponsiveReactGridLayout
                    onBreakpointChange={this.onBreakpointChange}
                    draggableHandle=".MyHandle"
                    {...this.props} style={{ backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' }}
                >

                    {this.props.nodes.map( node =>
                        <Card key={node.nodeid} style={{width: "parent", height: "parent", overflow: "hidden", borderColor: node.color,}} className="m-2">
                            <NodeContainer node={node} isGrid={true}/>
                        </Card>
                    )}
                </ResponsiveReactGridLayout>
            </Card>
        );
    }

}


const mapStavangerToProps = (stavanger: BioImageFlowStavanger) => ({
    nodes: stavanger.nodes.selectors.getComponents,
});

const mapStavangerToDispatch  = (stavanger: BioImageFlowStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(NodesContainer);
