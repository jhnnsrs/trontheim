import React, {Component} from "react";
import type {LatestRoiStavanger} from "../stavanger";
import {Card, CardBody, CardImg, CardSubtitle, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import * as _ from "lodash"

class Transformations extends Component {

    render() {
        const {transformations, reflections} = this.props;
        if (transformations.data) {
            return (
                <React.Fragment>
                {transformations.data.map((transformation, index) =>
                        <Card className="mt-2 overflow-auto" key={_.uniqueId()} onClick={() => this.props.selectTransformation(transformation)}>
                            <CardBody>
                                {reflections.data.filter(item => item.data.transformation === transformation.data.id).map((reflection, index) =>
                                <CardImg key={index} src={"http://localhost"+ reflection.data.image}/>
                                )}
                                <CardTitle>{transformation.data.name}</CardTitle>
                                <CardSubtitle>Transformation {transformation.data.id}</CardSubtitle>
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

const mapStavangerToProps = (stavanger: LatestRoiStavanger) => ({
    transformations: stavanger.transformations.selectors.getModel,
    reflections: stavanger.reflections.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: LatestRoiStavanger) =>  ({
    selectTransformation: (sample) => stavanger.transformations.model.selectItem.request(sample),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Transformations);
