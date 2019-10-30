import {Button, ButtonGroup, Card, CardBody, CardSubtitle, CardText, CardTitle} from "reactstrap";
import type {NodeBuilderStavanger} from "../stavanger";
import {connectInstrument} from "../../alta/react";
import React from "react";
import * as _ from "lodash";

class VarietySelector extends React.Component {

    render() {
        const {list} = this.props;
        if (list.data[0]) {
            return (
                <React.Fragment>
                    {list.data.map((variety, index) =>
                        <Card inverse className="mt-2 bg-dark" key={_.uniqueId()}>
                            <CardBody>
                                <CardTitle>{variety.data.name}</CardTitle>
                                <CardSubtitle>URI {variety.data.rooturl}</CardSubtitle>
                                <ButtonGroup>
                                    <Button className="mt-2" outline
                                            onClick={() => {this.props.selectItem(variety);this.props.toggle('3')}}>Select</Button>
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
    list: stavanger.varieties.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: NodeBuilderStavanger) =>  ({
    selectItem: (item) => stavanger.varieties.model.selectItem.request(item)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(VarietySelector);