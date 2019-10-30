import React, {Component} from "react";
import type {RepresentationStavanger} from "../stavanger";
import {Button, ButtonGroup, Card, CardBody, CardSubtitle, CardTitle, Container} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import RoisForDisplay from "./RoisForDisplay";
import ButtonToNavigate from "../../generics/ButtonToNavigate";
import List from "../../generics/List";
import * as _ from "lodash"

class DisplayList extends Component {

    render() {
        return(
            <List list={this.props.list}>
            { (display) =>
                        <Card className="mt-2 overflow-auto" key={display.data.id} onClick={() => this.props.selectItem(display)}>
                            <CardBody>
                                <CardTitle>{display.data.name}</CardTitle>
                                <CardSubtitle>Display {display.data.id}</CardSubtitle>
                                <Container>
                                    <ButtonGroup>
                                        <ButtonToNavigate size="sm" to={"/display/" + display.data.id}> 2D </ButtonToNavigate>
                                        { this.props.flows.data.map( (flow,key) =>
                                            <ButtonToNavigate key={_.uniqueId()} size="sm" outline  to={"/displayflow/"+flow.data.id+ "/display/" + display.data.id}>
                                                {flow.data.name}
                                            </ButtonToNavigate>
                                        )}
                                        <Button size="sm" outline color="danger" onClick={() => this.props.deleteItem(display)}>Delete</Button>
                                    </ButtonGroup>

                                    <RoisForDisplay display={display}/>
                                </Container>
                            </CardBody>
                        </Card>}
                </List>
            );
    }
}

const mapStavangerToProps = (stavanger: RepresentationStavanger) => ({
    list: stavanger.displays.selectors.getModel,
    flows: stavanger.displayflows.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: RepresentationStavanger) =>  ({
    selectItem: (item) => stavanger.displays.model.selectItem.request(item),
    deleteItem: (item) => stavanger.displays.model.deleteItem.request(item)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(DisplayList);
