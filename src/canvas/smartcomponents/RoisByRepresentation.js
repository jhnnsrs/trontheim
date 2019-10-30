import {Component} from "react";
import {connect} from "react-redux";
import React from "react";
import {Button, ButtonGroup, Card, CardBody, CardText, CardTitle, Col, Row} from "reactstrap";
import * as sta from "../actions"
import _ from 'lodash'
import {push} from "react-router-redux";
import {LOADING} from "../../alta/constants";


class RoisByRepresentation extends Component {

    renderRois(rois) {
        return (

            rois.map((roi) => {
                return (
                    <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333' }} className="mt-2" key={roi.data.id} onClick={() => this.selectActive(roi)}>
                        <CardTitle>{roi.data.id}</CardTitle>
                        <ButtonGroup>
                            <Button size={"sm"} outline onClick={() => this.props.deleteData(roi)} color={"danger"}> Delete </Button>
                            <Button size={"sm"} outline onClick={() => this.props.navigateTo("/trontheim/roi/" + roi.data.id)}> Open </Button>
                        </ButtonGroup>
                        { this.props.transformations && this.props.transformations.data.filter(item => item.data.roi === roi.data.id).map(transformation => {
                                if (transformation.data.image) {
                                    return <Button key={_.uniqueId()} size={"sm"} outline
                                                   onClick={() => this.props.navigateTo("/trontheim/roi/" + roi.data.id)}
                                                   style={{overflow: "hidden"}}>Line Rect 2D </Button>
                                } else {
                                    return <Button key={_.uniqueId()} size={"sm"} outline
                                                   onClick={() => this.props.navigateTo("/trontheim/roi/" + roi.data.id)}
                                                   style={{overflow: "hidden"}}>Line Rect Convert</Button>
                                }
                            }
                        )}
                    </Card>
                );
            }))
    }

    selectActive(roi){
        this.props.selectData(roi)
    }
    render() {
        const { data, meta } = this.props.rois;

        if(meta.status === LOADING) {
            return <div className="alert alert-warning">Rois loading</div>
        } else if(meta.error) {
            return <div className="alert alert-danger">Error: {meta.error}</div>
        }

        return (
            this.renderRois(data)
        );
    }
}


const mapStateToProps = state => {
    return {
        rois: state.canvas.rois,
        transformations: state.canvas.transformations
    };
};

const mapDispatchToProps = {
    navigateTo: (link) => push(link),
    selectData: (roi) => sta.rois.model.selectItem.request(roi),
    deleteData: (roi) => sta.rois.model.deleteItem.request(roi),
};

export default connect(mapStateToProps, mapDispatchToProps)(RoisByRepresentation);
