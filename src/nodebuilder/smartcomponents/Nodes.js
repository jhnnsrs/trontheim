import {Button, ButtonGroup, Card, CardBody, CardSubtitle, CardText, CardTitle} from "reactstrap";
import type {NodeBuilderStavanger} from "../stavanger";
import {connectInstrument} from "../../alta/react";
import React from "react";
import * as _ from "lodash";
import List from "../../generics/List";

class Nodes extends React.Component {

    render() {
        return(
            <List list={this.props.list}>
            { (item) =>
                        <Card inverse className="mt-2 bg-dark" key={_.uniqueId()} onClick={() => this.props.selectItem(item)}>
                            <CardBody>
                                <CardTitle>{item.data.name}</CardTitle>
                                <CardSubtitle>URI {item.data.rooturl}</CardSubtitle>
                                <Button onClick={() => this.props.deleteItem(item)}>Delete</Button>
                            </CardBody>

                        </Card>
            }
            </List>
        )
    }
}

const mapStavangerToProps = (stavanger: NodeBuilderStavanger) => ({
    list: stavanger.nodes.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: NodeBuilderStavanger) =>  ({
    selectItem: (item) => stavanger.nodes.model.selectItem.request(item),
    deleteItem: (item) => stavanger.nodes.model.deleteItem.request(item)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Nodes);