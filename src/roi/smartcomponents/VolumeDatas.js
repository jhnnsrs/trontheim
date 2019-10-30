import React, {Component} from "react";
import type {RoiStavanger} from "../stavanger";
import {Button, ButtonGroup, Card, CardBody, CardSubtitle, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import * as _ from "lodash"


class VolumeDatas extends Component {

    render() {
        const {datas} = this.props;
        if (datas) {
            return (
                <React.Fragment>
                {datas.map((data, index) =>
                        <Card className="mt-2" key={_.uniqueId()} onClick={() => this.props.selectData(data)}>
                            <CardBody>
                                <CardTitle>Volumetric Data{data.data.id}</CardTitle>
                                <CardSubtitle>Roi {data.data.roi}</CardSubtitle>
                                <small><b>Length </b>{data.data.physicallength} µm</small><br/>
                                <small><b>Threshold </b>{data.data.threshold*100} %</small><br/>
                                <small><b>Vid </b>{data.data.vid} µm</small><br/>
                                <ButtonGroup>
                                    <Button className="mt-2" outline color="danger" onClick={() => this.props.deletedData(data)}>Delete</Button>
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

const mapStavangerToProps = (stavanger: RoiStavanger) => ({
    datas: stavanger.volumedatas.selectors.getList,
});

const mapStavangerToDispatch  = (stavanger: RoiStavanger) =>  ({
    selectData: (roi) => stavanger.volumedatas.model.selectItem.request(roi),
    deleteData: (roi) => stavanger.volumedatas.model.deleteItem.request(roi)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(VolumeDatas);
