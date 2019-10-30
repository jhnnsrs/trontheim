import React from "react"
import type {Stavanger} from "../alta/stavanger";
import type {HortenTable} from "../alta/horten/table";
import {LineRoi} from "./rois/LineRoi";
import {connectInstrument} from "../alta/react";


const Rois = (props ) => {
    return <React.Fragment>
        {props.rois.map((roi) => <LineRoi key={roi.data.id} roi={roi.data}/>)}
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


export const RoisCreator = (accesor: (Stavanger) => HortenTable) => {

    const mapStavangerToProps = (stavanger) => ({
        rois: accesor(stavanger).selectors.getList,
    });


    const mapStavangerToDispatch = (stavanger) => ({
    });


    return connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Rois);

}