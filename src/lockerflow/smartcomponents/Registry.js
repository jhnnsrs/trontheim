import React from "react";
import {connectInstrument} from "../../alta/react";
import {Card} from "reactstrap";


import {Responsive, WidthProvider} from "react-grid-layout";
import type {HortenRegistry} from "../../alta/horten/registry";
import type {HortenItem} from "../../alta/horten/item";
import Node from "./Node";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export interface RegistryStavanger  {
    registry: HortenRegistry
}

export interface LayoutStavanger {
    layout: HortenItem
}

export type LayRegSta = RegistryStavanger & LayoutStavanger


class NodesContainer extends React.PureComponent {



    constructor(props) {
        super(props);
        this.onBreakpointChange = this.onBreakpointChange.bind(this);
        this.gridProps = {
            className: "layout",
            cols: { lg: 2, md: 2, sm: 2, xs: 1, xxs: 1 },
            rowHeight: 400
        };
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
        this.props.updateLayout(layout)
    }




    render() {
        let {nodes, layoutna} = this.props
        let layoutclass = layoutna ? JSON.parse(layoutna.layout) : {}
        return (
            <React.Fragment>
                <ResponsiveReactGridLayout
                    onBreakpointChange={this.onBreakpointChange}
                    draggableHandle=".MyHandle"
                    {...this.gridProps}
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' }}
                    layouts={layoutclass}
                    onLayoutChange={(layout, layouts) => this.onLayoutChange(layouts)}
                >

                    {this.props.nodes.map( node =>
                        <Card key={node.id} style={{width: "300", height: "parent", overflow: "hidden", borderColor: node.color,}} className="mb-2">
                            <Node instance={node.instance} path={node.path} />
                        </Card>
                    )}
                </ResponsiveReactGridLayout>
            </React.Fragment>
        );
    }

}


const mapStavangerToProps = (stavanger: LayRegSta) => ({
    nodes: stavanger.registry.selectors.getComponents,
    layoutna: stavanger.layout.selectors.getData,
});

const mapStavangerToDispatch  = (stavanger: LayRegSta) =>  ({
    updateLayout: (layout) => stavanger.layout.model.dynamic("SET_LAYOUT").request(layout),
    updateOnServer: () => stavanger.layout.model.dynamic("UPDATE_LAYOUT").request(),
    createOnServer: () => stavanger.layout.model.dynamic("CREATE_LAYOUT").request()
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(NodesContainer);
