import React, {Component} from "react";
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardImg,
    CardImgOverlay,
    CardSubtitle,
    CardText,
    CardTitle
} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import Octicon, {Plus} from "@githubprimer/octicons-react";
import type {BioConverterStavanger, TransformationCollectorStavanger} from "./index";
import * as _ from "lodash";

class BioSeriesList extends Component {

    render() {
        const {list} = this.props;
        if (list.data[0]) {
            return (
                <React.Fragment>
                    {list.data.map((bioseries, index) =>
                        <Card className="mt-2" key={_.uniqueId()}>
                            <CardBody>
                                <CardTitle>{bioseries.data.name}</CardTitle>
                                <CardSubtitle>BioSeries {bioseries.data.id}</CardSubtitle>
                                <ButtonGroup>
                                    <Button className="mt-2" outline
                                            onClick={() => this.props.selectItem(bioseries)}>Select</Button>
                                    <Button className="mt-2" outline
                                            onClick={() => this.props.deleteItem(bioseries)}>Delete</Button>
                                </ButtonGroup>
                            </CardBody>

                        </Card>)}
                </React.Fragment>
            );
        } else {
            return (<Card className="mt-2" key={_.uniqueId()}>
                <CardBody>
                    <CardTitle>No BioSeries</CardTitle>
                    <CardSubtitle>Module has not yet received a BioSeries</CardSubtitle>
                </CardBody>

            </Card>)

        }
    }
}

const mapStavangerToProps = (stavanger: TransformationCollectorStavanger) => ({
    list: stavanger.transformations.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: TransformationCollectorStavanger) =>  ({
    selectItem: (item) => stavanger.transformations.model.selectItem.request(item),
    deleteItem: (item) => stavanger.transformations.model.deleteItem.request(item)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(BioSeriesList);
