import {Button} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import type {ForeignMaskerStavanger} from "./index";

class LineRectComponent extends Component<any,any> {
    render() {
        return (
            <React.Fragment>
                Copy this NodeID to your ForeignNode
                <h3>{this.props.edge.nodeid}</h3>
                <Button onClick={() => this.props.initialize()}>Initialize</Button>
            </React.Fragment>
        );
    }
}

const mapStavangerToProps = (stavanger: ForeignMaskerStavanger) => ({
    edge: stavanger.edge.selectors.getModel
});

const mapStavangerToDispatch  = (stavanger: ForeignMaskerStavanger) =>  ({
    initialize: () => stavanger.edge.model.dynamic("INITI").request({})
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(LineRectComponent);