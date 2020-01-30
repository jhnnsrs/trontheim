//@flow

import _ from "lodash";
import {LinearGradient} from "@vx/gradient";
import React from "react"
import {LinePath} from "@vx/shape";
import {curveBasis} from "d3-shape";
import type {DataStructure, RoiModel} from "../types/models";

//Accesors
const x = item => item.x
const y = item => item.y
const scale = item => item

type LineRoiType = DataStructure<RoiModel>

type LineRoiProps = {
    roi: LineRoiType
}

export const LineRoi = (props: LineRoiProps) => {
    if (!props.roi.data) return ""
    try {
        //TODO: Implement Type Check here
        let data = props.roi.data
        let stroke;
        let vectors = JSON.parse(data.vectors);
        stroke = "stroke" + data.id;
        return (
            <g key={_.uniqueId()}>
                <LinearGradient id={stroke} from={data.color} to={data.color}/>
                <LinePath
                    key={`line-` + data.id}
                    stroke={"url(#" + stroke + ")"}
                    strokeWidth={3}
                    data={vectors}
                    curve={curveBasis}
                    x={x}
                    y={y}
                />
            </g>
        )
    }
    catch (e) {
        return ""
    }
}
