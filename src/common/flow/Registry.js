import React from "react";
import {connectInstrument} from "../../alta/react";
import {Card} from "reactstrap";


import {Responsive, WidthProvider} from "react-grid-layout";
import type {HortenRegistry} from "../../alta/horten/registry";
import type {HortenItem} from "../../alta/horten/item";
import Node from "./Node";
import {ResponsiveReactGridLayout} from "../../flow/smartcomponents/NodeGridContainer";
import type {FlowStavanger} from "../../maestros/flowMeastro";


export interface RegistryStavanger  {
    registry: HortenRegistry
}

export interface LayoutStavanger {
    selectedLayout: HortenItem
}

export type LayRegSta = RegistryStavanger & LayoutStavanger


class Registry extends React.PureComponent {

    static defaultProps = {
        className: "layout",
        cols: { lg: 8, md: 4, sm: 4, xs: 4, xxs: 4 },
        rowHeight: 200
    };

    constructor(props) {
        super(props);
        this.onBreakpointChange = this.onBreakpointChange.bind(this);
        this.onLayoutChange = this.onLayoutChange.bind(this);
    }

    // We're using the cols coming back from this to calculate where to add new items.
    onBreakpointChange(breakpoint, cols) {
        this.setState({
            breakpoint: breakpoint,
            cols: cols
        });
    }


    onLayoutChange(layout) {
        // TODO: THIS WILL FIRE BEFORE EPICS ARE INSTANTIATED
        if (this.props.layoutna) {this.props.updateLayout(layout)}
    }



    render() {
        let {nodes, layoutna} = this.props
        if (nodes.length == 0) return "" // ATTENTION: This is the most crucial part. For some weird reason GridLayout will not update its layout if nodes are not set at the exact same time. weird but okay
        let layoutclass = layoutna ? JSON.parse(layoutna.layout) : []
        return (
            <React.Fragment>
                <ResponsiveReactGridLayout
                    onBreakpointChange={this.onBreakpointChange}
                    draggableHandle=".MyHandle"
                    {...this.props}
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' }}
                    layouts={layoutclass}
                    onLayoutChange={(layout, layouts) => this.onLayoutChange(layouts)}
                >

                    {this.props.nodes.map( node =>
                        <Card key={node.id} style={{width: "300", height: "parent", overflow: "hidden", borderColor: node.color}} className="mb-2">
                            <Node instance={node.instance} path={node.path} />
                        </Card>
                    )}
                </ResponsiveReactGridLayout>
            </React.Fragment>
        );
    }

}


const mapStavangerToProps = (stavanger: FlowStavanger) => ({
    nodes: stavanger.registry.selectors.getComponents,
    layoutna: stavanger.selectedLayout.selectors.getData,
});

const mapStavangerToDispatch  = (stavanger: FlowStavanger) =>  ({
    updateLayout: (layout) => stavanger.selectedLayout.model.dynamic("SET_LAYOUT").request(layout),
    updateOnServer: () => stavanger.selectedLayout.model.dynamic("UPDATE_LAYOUT").request(),
    createOnServer: () => stavanger.selectedLayout.model.dynamic("CREATE_LAYOUT").request()
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Registry);
