import React, {Component} from "react";
import type {RepresentationStavanger} from "../stavanger";
import {Button, ButtonGroup, Card, CardBody, CardSubtitle, CardTitle, Container} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import ButtonToNavigate from "../../generics/ButtonToNavigate";
import List from "../../generics/List";
import * as _ from "lodash"

class DisplayList extends Component {

    render() {
        return(
            <List list={this.props.list}>
            { (exhibit) =>
                        <Card className="mt-2 overflow-auto" key={exhibit.data.id} onClick={() => this.props.selectItem(exhibit)}>
                            <CardBody>
                                <CardTitle>{exhibit.data.id}</CardTitle>
                                <CardSubtitle>Exhibit {exhibit.data.id}</CardSubtitle>
                                <Container>
                                    <ButtonGroup>
                                        <ButtonToNavigate size="sm" to={"/exhibit/" + exhibit.data.id}> 3D </ButtonToNavigate>
                                        { this.props.flows.data.map( (flow,key) =>
                                            <ButtonToNavigate key={_.uniqueId()} size="sm" outline  to={"/exhibitflow/"+flow.data.id+ "/exhibit/" + exhibit.data.id}>
                                                {flow.data.name}
                                            </ButtonToNavigate>
                                        )}
                                        <Button size="sm" outline color="danger" onClick={() => this.props.deleteItem(exhibit)}>Delete</Button>
                                    </ButtonGroup>
                                </Container>
                            </CardBody>
                        </Card>}
                </List>
            );
    }
}

const mapStavangerToProps = (stavanger: RepresentationStavanger) => ({
    list: stavanger.exhibits.selectors.getModel,
    flows: stavanger.displayflows.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: RepresentationStavanger) =>  ({
    selectItem: (item) => stavanger.exhibits.model.selectItem.request(item),
    deleteItem: (item) => stavanger.exhibits.model.deleteItem.request(item)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(DisplayList);
