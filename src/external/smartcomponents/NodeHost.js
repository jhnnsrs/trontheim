import React from "react";
import {connectInstrument} from "../../alta/react";
import {Card} from "reactstrap";
import type {HortenRegistry} from "../../alta/horten/registry";
import type {HortenItem} from "../../alta/horten/item";
import Node from "./Node";


export interface RegistryStavanger  {
    registry: HortenRegistry
}

export interface LayoutStavanger {
    layout: HortenItem
}

export type LayRegSta = RegistryStavanger & LayoutStavanger


class NodeHost extends React.PureComponent {

    static defaultProps = {
        className: "layout",
        cols: { lg: 8, md: 4, sm: 4, xs: 4, xxs: 4 },
        rowHeight: 200
    };

    constructor(props) {
        super(props);
    }




    render() {
        let {nodes} = this.props
        return (
            nodes.map( node =>
                        <Card key={node.id} style={{width: "300", height: "parent", overflow: "hidden", borderColor: node.color}} className="mb-2">
                            <Node instance={node.alias} path={node.path} />
                        </Card>
                    )
        );
    }

}


const mapStavangerToProps = (stavanger: LayRegSta) => ({
    nodes: stavanger.registry.selectors.getComponents,
});

const mapStavangerToDispatch  = (stavanger: LayRegSta) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(NodeHost);
