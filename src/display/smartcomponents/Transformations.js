import React, {Component} from "react";
import type {DisplayStavanger} from "../stavanger";
import {Card, CardBody, CardSubtitle, CardTitle, Container} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import * as _ from "lodash"

class Transformations extends Component {

    render() {
        const {representations: transformations} = this.props;
        if (transformations.data) {
            return (
                <React.Fragment>
                {transformations.data.map((transformation, index) =>
                        <Card className="mt-2 overflow-auto" key={_.uniqueId()} onClick={() => this.props.selectTransformation(transformation)}>
                            <CardBody>
                                <CardTitle>{transformation.data.name}</CardTitle>
                                <CardSubtitle>Transformation {transformation.data.id}</CardSubtitle>
                                <Container>
                                </Container>
                            </CardBody>
                        </Card>)}
                </React.Fragment>
            );
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: DisplayStavanger) => ({
    representations: stavanger.transformations.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: DisplayStavanger) =>  ({
    selectTransformation: (sample) => stavanger.transformations.model.selectItem.request(sample),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Transformations);
