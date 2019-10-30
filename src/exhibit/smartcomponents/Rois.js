import React, {Component} from "react";
import type {ExhibitStavanger} from "../stavanger";
import {Button, ButtonGroup, Card, CardBody, CardSubtitle, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import * as _ from "lodash"

class CustomizedDot extends React.Component {
    render() {
        const { color} = this.props;

        return (
            <circle r={25} stroke="black" strokeWidth={1} fill={color} />
        );
    }
};


class Rois extends Component {

    render() {
        const {rois} = this.props;
        if (rois.data) {
            return (
                <React.Fragment>
                {rois.data.map((roi, index) =>
                        <Card className="mt-2" key={_.uniqueId()} onClick={() => this.props.selectRoi(roi)}>
                            <CardBody>
                                <CardTitle>{roi.data.id}</CardTitle>
                                <CardSubtitle>Roi {roi.data.representation}</CardSubtitle>
                                <CustomizedDot color={roi.data.color}/>
                                <ButtonGroup>
                                    <Button className="mt-2" outline color="danger" onClick={() => this.props.deleteRoi(roi)}>Delete</Button>
                                </ButtonGroup>
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

const mapStavangerToProps = (stavanger: ExhibitStavanger) => ({
    rois: stavanger.rois.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: ExhibitStavanger) =>  ({
    selectRoi: (roi) => stavanger.rois.model.selectItem.request(roi),
    deleteRoi: (roi) => stavanger.rois.model.deleteItem.request(roi)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Rois);
