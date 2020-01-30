import React, {Component} from "react";
import type {RoiForSampleStavanger} from "../stavanger";
import {ButtonGroup, Row} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import ButtonToNavigate from "../../generics/ButtonToNavigate";

class Rois extends Component {

    render() {
        const { rois} = this.props;
        if (rois.data) {
            return (
                <React.Fragment>
                    {rois.data.map( (roi, key) =>
                        <Row className="mt-2"  key={key}>
                            <ButtonGroup>
                                <ButtonToNavigate to={"/roi/"+roi.data.id}> {roi.data.id}</ButtonToNavigate>
                            </ButtonGroup>
                        </Row>)
                    }
                </React.Fragment>);
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: RoiForSampleStavanger) => ({
    rois: stavanger.rois.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: RoiForSampleStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Rois);
