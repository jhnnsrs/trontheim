import React from "react";
import type {BioImageFlowStavanger} from "../stavanger";
import {connectInstrument} from "../../alta/react";
import {NodeTestContainer} from "../../alta/react/Nodes";
import {Card} from "reactstrap";


import {Responsive, WidthProvider} from "react-grid-layout";

export const ResponsiveReactGridLayout = WidthProvider(Responsive);


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


    onLayoutChange(layout) {
        this.props.updateLayout(layout)
    }




    render() {
        let {nodes, layoutna} = this.props
        let layoutclass = layoutna ? JSON.parse(layoutna.layout) : {}
        console.log(layoutclass)
        console.log(this.props)
        return (
            <React.Fragment>
                <ResponsiveReactGridLayout
                    onBreakpointChange={this.onBreakpointChange}
                    draggableHandle=".MyHandle"
                    {...this.props} style={{ backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' }}
                    layouts={layoutclass}
                    onLayoutChange={(layout, layouts) => this.onLayoutChange(layouts)}
                >

                    {this.props.nodes.map( node =>
                        <Card key={node.id} style={{width: "300", height: "parent", overflow: "hidden", borderColor: node.color,}} className="mb-2">
                            <NodeTestContainer node={node} isGrid={true}/>
                        </Card>
                    )}
                </ResponsiveReactGridLayout>
            </React.Fragment>
        );
    }

}


const mapStavangerToProps = (stavanger: BioImageFlowStavanger) => ({
    nodes: stavanger.nodes.selectors.getComponents,
    layoutna: stavanger.layout.selectors.getData,
});

const mapStavangerToDispatch  = (stavanger: BioImageFlowStavanger) =>  ({
    updateLayout: (layout) => stavanger.layout.model.dynamic("SET_LAYOUT").request(layout),
    updateOnServer: () => stavanger.layout.model.dynamic("UPDATE_LAYOUT").request(),
    createOnServer: () => stavanger.layout.model.dynamic("CREATE_LAYOUT").request()
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(NodesContainer);
