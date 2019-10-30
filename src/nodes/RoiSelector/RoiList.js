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
    CardTitle, Table
} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import Octicon, {Plus} from "@githubprimer/octicons-react";
import type {RoiSelectorStavanger} from "./index";
import * as _ from "lodash";

class RoiList extends Component {

    render() {
        const {rois} = this.props;
        if (rois.data[0]) {
            return (
                <Table className="overflow-auto">
                    <thead>
                        <tr>
                            <th> # </th>
                            <th> Sel </th>
                            <th> Del </th>
                        </tr>
                    </thead>
                    <tbody>
                    {rois.data.map((roi, index) =>
                        <tr key={_.uniqueId()}>
                            <th scope="row">{roi.data.id}</th>
                            <td><Button style={{backgroundColor: roi.data.color, color: "black"}} onClick={() => this.props.selectItem(roi)}>Select</Button></td>
                            <td><Button outline color="danger" onClick={() => this.props.deleteItem(roi)}>Delete</Button></td>
                        </tr>)}
                    </tbody>
                </Table>
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

const mapStavangerToProps = (stavanger: RoiSelectorStavanger) => ({
    rois: stavanger.rois.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: RoiSelectorStavanger) =>  ({
    selectItem: (item) => stavanger.rois.model.selectItem.request(item),
    deleteItem: (item) => stavanger.rois.model.deleteItem.request(item)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(RoiList);
