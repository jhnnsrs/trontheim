import React, {Component} from "react";
import {Button, ButtonGroup, Card, CardBody, CardSubtitle, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import type {ExhibitSelectorStavanger} from "./index";
import * as _ from "lodash";

class RepresentationList extends Component {

    render() {
        const {exhibits} = this.props;
        if (exhibits.data[0]) {
            return (
                <React.Fragment>
                    {exhibits.data.map((representation, index) =>
                        <Card className="mt-2" key={_.uniqueId()}>
                            <CardBody>
                                <CardTitle>{representation.data.name}</CardTitle>
                                <CardSubtitle>Roi {representation.data.id}</CardSubtitle>
                                <ButtonGroup>
                                    <Button className="mt-2" outline
                                            onClick={() => this.props.selectItem(representation)}>Select</Button>
                                    <Button className="mt-2" outline
                                            onClick={() => this.props.deleteItem(representation)}>Delete</Button>
                                </ButtonGroup>
                            </CardBody>

                        </Card>)}
                </React.Fragment>
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

const mapStavangerToProps = (stavanger: ExhibitSelectorStavanger) => ({
    exhibits: stavanger.exhibits.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: ExhibitSelectorStavanger) =>  ({
    selectItem: (item) => stavanger.exhibits.model.selectItem.request(item),
    deleteItem: (item) => stavanger.exhibits.model.deleteItem.request(item)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(RepresentationList);
