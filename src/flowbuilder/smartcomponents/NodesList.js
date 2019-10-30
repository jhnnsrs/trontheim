import React from "react";
import {Button, ButtonGroup, Card, CardBody, CardColumns, CardSubtitle, CardTitle} from "reactstrap";
import * as _ from "lodash";
import {connectInstrument} from "../../alta/react";
import type {FlowBuilderStavanger} from "../stavanger";
import Octicon, {Trashcan} from "@githubprimer/octicons-react";
import NodeDrag from "./NodeDrag";

class List extends React.Component {

    render() {
        const {list} = this.props;
        if (list.data[0]) {
            return (
                <Card body inverse style={{ backgroundColor: '#333', borderColor: '#FFFFFF' }} className={"mt-2"}>
                    <CardTitle>Nodes</CardTitle>
                    <CardColumns>
                    {list.data.map((item, index) =>
                            <NodeDrag node={item}/>)}
                    </CardColumns>
                </Card>
            );
        } else {
            return (<Card className="mt-2" key={_.uniqueId()}>
                <CardBody>
                    <CardTitle>No Nodes</CardTitle>
                    <CardSubtitle>Module has not yet received a Node</CardSubtitle>
                </CardBody>

            </Card>)

        }
    }
}

const mapStavangerToProps = (stavanger: FlowBuilderStavanger) => ({
    list: stavanger.nodesList.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: FlowBuilderStavanger) =>  ({
    selectItem: (item) => stavanger.nodesList.model.selectItem.request(item),
    deleteItem: (item) => stavanger.nodesList.model.deleteItem.request(item)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(List);