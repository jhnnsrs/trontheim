import React from "react"
import type {Stavanger} from "../alta/stavanger";
import type {HortenTable} from "../alta/horten/table";
import {LineRoi} from "./rois/LineRoi";
import {connectInstrument} from "../alta/react";


const Roi = ({roi}) => {
    if (!roi) return "" //TODO: Check for different types
    return <LineRoi roi={roi}/>
}


export const mapStavangerToProps = (stavanger) => {

    return {
        roi: stavanger.roi.selectors.getData,
    };
};


export const mapStavangerToDispatch = (stavanger) => ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Roi);


export const RoiCreator = (accesor: (Stavanger) => HortenTable) => {

    const mapStavangerToProps = (stavanger) => ({
        roi: accesor(stavanger).selectors.getData,
    });


    const mapStavangerToDispatch = (stavanger) => ({
    });


    return connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Roi);

}