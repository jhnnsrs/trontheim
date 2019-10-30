import type {RoiShowStavanger} from "./index";
import {connectInstrument} from "../../alta/react";
import {TwoDShowComponent} from "./TwoDShowComponent";
import {LineRoi} from "../../fabric/LineRoi";
import React from "react"


const Rois = (props ) => {
    return <React.Fragment>
        {props.rois.map((roi) => <LineRoi roi={roi}/>)}
    </React.Fragment>


}


export const mapStavangerToProps = (stavanger: RoiShowStavanger) => {

    return {
        rois: stavanger.rois.selectors.getList,
    };
};


export const mapStavangerToDispatch = (stavanger: RoiShowStavanger) => ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Rois);