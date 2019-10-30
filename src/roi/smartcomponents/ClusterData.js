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
                                <CardTitle>Cluster Data{data.data.id}</CardTitle>
                                <CardSubtitle>Roi {data.data.roi}</CardSubtitle>
                                <small><b>NumberCluster </b>{data.data.clusternumber}</small><br/>
                                <small><b>ClusterArea </b>{data.data.cluserarea} {data.data.spatialunit}</small><br/>
                                <ButtonGroup>
                                    <Button className="mt-2" outline color="danger" onClick={() => this.props.deleteData(data)}>Delete</Button>
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
    datas: stavanger.clusterdata.selectors.getList,
});

const mapStavangerToDispatch  = (stavanger: RoiStavanger) =>  ({
    selectData: (roi) => stavanger.clusterdata.model.selectItem.request(roi),
    deleteData: (roi) => stavanger.clusterdata.model.deleteItem.request(roi)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(VolumeDatas);
