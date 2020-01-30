import React, {Component} from "react";
import {Button, ButtonGroup, Card, CardBody, CardSubtitle, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import type {ChannelSelector} from "./index";
import * as _ from "lodash";

class SelectionList extends Component {

    render() {
        const {list} = this.props;
        if (list.data[0]) {
            return (
                <React.Fragment>
                    {list.data.map((item, index) =>
                        <Card className="mt-2" key={_.uniqueId()}>
                            <CardBody>
                                <CardTitle>{item.data.Name}</CardTitle>
                                <CardSubtitle>Channel {item.data.Index}</CardSubtitle>
                                <ButtonGroup>
                                    <Button className="mt-2" outline
                                            onClick={() => this.props.selectItem(item)}>Select</Button>
                                    <Button className="mt-2" outline
                                            onClick={() => this.props.deleteItem(item)}>Delete</Button>
                                </ButtonGroup>
                            </CardBody>

                        </Card>)}
                </React.Fragment>
            );
        } else {
            return (<Card className="mt-2" key={_.uniqueId()}>
                <CardBody>
                    <CardTitle>No Locker</CardTitle>
                    <CardSubtitle>Module has not yet received a Locker</CardSubtitle>
                </CardBody>

            </Card>)

        }
    }
}

const mapStavangerToProps = (stavanger: ChannelSelector) => ({
    list: stavanger.channels.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: ChannelSelector) =>  ({
    selectItem: (item) => stavanger.channels.model.selectItem.request(item),
    deleteItem: (item) => stavanger.channels.model.deleteItem.request(item)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(SelectionList);
