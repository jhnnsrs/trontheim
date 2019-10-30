import React, {Component} from "react";
import type {RoiStavanger} from "../stavanger";
import {Button, Card, CardBody, CardImg, CardSubtitle, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import * as _ from "lodash"

class Transformations extends Component {

    render() {
        const {transformations, reflections} = this.props;
        if (transformations) {
            return (
                <React.Fragment>
                {transformations.map((transformation, index) =>
                        <Card className="mt-2 overflow-auto" key={_.uniqueId()} onClick={() => this.props.selectTransformation(transformation)}>
                            <CardBody>
                                {reflections.filter(item => item.data.transformation === transformation.data.id).map((reflection, index) =>
                                <CardImg key={index} src={reflection.data.image}/>
                                )}
                                <CardTitle>{transformation.data.name}</CardTitle>
                                <CardSubtitle>Transformation {transformation.data.id}</CardSubtitle>
                                <CardText>
                                    <Button onClick={() => this.props.deleteTransformation(transformation)}> DELETE </Button>
                                </CardText>
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

const mapStavangerToProps = (stavanger: RoiStavanger) => ({
    transformations: stavanger.transformations.selectors.getList,
    reflections: stavanger.reflections.selectors.getList,
});

const mapStavangerToDispatch  = (stavanger: RoiStavanger) =>  ({
    selectTransformation: (sample) => stavanger.transformations.model.selectItem.request(sample),
    deleteTransformation: (sample) => stavanger.transformations.model.deleteItem.request(sample),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Transformations);
