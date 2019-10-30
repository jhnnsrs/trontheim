import React, {Component} from "react";
import type {BioImageFlowStavanger, SampleFlowStavanger} from "../stavanger";
import {connectInstrument} from "../../alta/react";
import {NodeTestContainer} from "../../alta/react/Nodes";
import * as _ from 'lodash'
import {Button} from "reactstrap";


class LayoutList extends Component {
    render() {
        let {possibleLayouts} = this.props
        return (
            <div>
                { possibleLayouts.map((layout) => <Button onClick={() => this.props.selectLayout(layout)}>{layout.data.name}</Button> )}
            </div>
        );
    }
}

const mapStavangerToProps = (stavanger: BioImageFlowStavanger) => ({
    possibleLayouts: stavanger.possibleLayouts.selectors.getList,
});

const mapStavangerToDispatch  = (stavanger: BioImageFlowStavanger) =>  ({
    selectLayout: (layout) => stavanger.possibleLayouts.model.selectItem.request(layout),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(LayoutList);
