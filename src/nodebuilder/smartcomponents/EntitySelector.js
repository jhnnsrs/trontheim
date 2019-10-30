import {Button, ButtonGroup, Card, CardBody, CardSubtitle, CardText, CardTitle} from "reactstrap";
import type {NodeBuilderStavanger} from "../stavanger";
import {connectInstrument} from "../../alta/react";
import React from "react";
import * as _ from "lodash";

class EntitySelector extends React.Component {

    render() {
        const {list} = this.props;
        if (list.data[0]) {
            return (
                <React.Fragment>
                    {list.data.map((entity, index) =>
                        <Card inverse className="mt-2 bg-dark" key={_.uniqueId()}>
                            <CardBody>
                                <CardTitle>{entity.data.name}</CardTitle>
                                <CardSubtitle>URI {entity.data.rooturl}</CardSubtitle>
                                <ButtonGroup>
                                    <Button className="mt-2" outline
                                            onClick={() => {this.props.toggle('4');this.props.selectItem(entity);}}>Select</Button>
                                </ButtonGroup>
                            </CardBody>

                        </Card>)}
                </React.Fragment>
            );
        } else {
            return (<Card className="mt-2 bg-dark" key={_.uniqueId()}>
                <CardBody>
                    <CardTitle>No Sample</CardTitle>
                    <CardSubtitle>There is No Arnheim Hosts Ailable for this</CardSubtitle>
                </CardBody>

            </Card>)

        }
    }
}

const mapStavangerToProps = (stavanger: NodeBuilderStavanger) => ({
    list: stavanger.entities.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: NodeBuilderStavanger) =>  ({
    selectItem: (item) => stavanger.entities.model.selectItem.request(item)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(EntitySelector);