import {Button, ButtonGroup, Card, CardBody, CardTitle} from "reactstrap";
import type {BioImageFlowStavanger} from "../../flow/stavanger";
import {connectInstrument} from "../../alta/react";
import React from "react";
import LayoutSelector from "./LayoutSelector";
import type {FlowStavanger} from "../../maestros/flowMeastro";

class LayoutList extends React.Component {
    render() {
        let {possibleLayouts,layout, selectLayout} = this.props
        return (
            <Card className="mt-2">
                <CardBody>
                    <CardTitle>
                        <LayoutSelector selected={layout} list={possibleLayouts} select={selectLayout}/><br/>
                    </CardTitle>
                        <ButtonGroup>
                            {layout && <Button outline onClick={() => this.props.updateOnServer()}>Update</Button>}
                         <Button outline onClick={() => this.props.createOnServer()}>Create New</Button>
                        </ButtonGroup>
                </CardBody>
            </Card>
        );
    }
}

const mapStavangerToProps = (stavanger: FlowStavanger) => ({
    layout: stavanger.selectedLayout.selectors.getData,
    possibleLayouts: stavanger.availableLayouts.selectors.getList,
});

const mapStavangerToDispatch  = (stavanger: FlowStavanger) =>  ({
    selectLayout: (layout) => stavanger.availableLayouts.model.selectItem.request(layout),
    updateOnServer: () => stavanger.selectedLayout.model.dynamic("UPDATE_LAYOUT").request(),
    createOnServer: () => stavanger.selectedLayout.model.dynamic("CREATE_LAYOUT").request()
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(LayoutList);