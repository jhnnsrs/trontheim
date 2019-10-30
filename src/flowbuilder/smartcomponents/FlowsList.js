import React from "react";
import {Button, ButtonGroup, Card, CardBody, CardSubtitle, CardTitle} from "reactstrap";
import * as _ from "lodash";
import {connectInstrument} from "../../alta/react";
import type {FlowBuilderStavanger} from "../stavanger";
import Octicon, {Squirrel, Trashcan} from "@githubprimer/octicons-react";

class List extends React.Component {

    render() {
        const {list} = this.props;
        if (list.data[0]) {
            return (
                <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333' }} className={"mt-2"}>
                    <CardTitle>FlowBank</CardTitle>
                    {list.data.map((item, index) =>
                        <ButtonGroup key={item.data.id}>
                            <Button outline color={"light"} size={"sm"} onClick={() => this.props.selectItem(item)}>{item.data.name}</Button>
                            <Button outline color={"light"} size={"sm"} onClick={() => this.props.loadItem(item)}><Octicon color="black" icon={Squirrel} ariaLabel="Load Item"/></Button>
                            <Button outline color={"light"} size={"sm"} onClick={() => this.props.deleteItem(item)}><Octicon color="black" icon={Trashcan} ariaLabel="Delete item"/></Button>
                            <br/>
                        </ButtonGroup>)}
                </Card>
            );
        } else {
            return (<Card className="mt-2" key={_.uniqueId()}>
                <CardBody>
                    <CardTitle>No Sample</CardTitle>
                    <CardSubtitle>Module has not yet received a Sample</CardSubtitle>
                </CardBody>

            </Card>)

        }
    }
}

const mapStavangerToProps = (stavanger: FlowBuilderStavanger) => ({
    list: stavanger.flows.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: FlowBuilderStavanger) =>  ({
    selectItem: (item) => stavanger.flows.model.selectItem.request(item),
    deleteItem: (item) => stavanger.flows.model.deleteItem.request(item),
    loadItem: (item) => stavanger.flows.model.dynamic("LOAD_TO_GRAPH").request(item),

});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(List);