import React, {Component} from "react";
import {LinePath} from "@vx/shape";
import {curveBasis} from "d3-shape";
import PropTypes from "prop-types";

//Accesors
const x = item => item.x
const y = item => item.y
const scale = item => item



export class LineRoi extends Component {
    render() {
        return <LinePath
            key={`line-` + this.props.id}
            stroke={"url(#" + this.props.stroke + ")"}
            strokeWidth={3}
            data={this.props.vectors}
            curve={curveBasis}
            x={x}
            y={y}
            xScale={scale}
            yScale={scale}
        />;
    }
}

LineRoi.propTypes = {
    id: PropTypes.any,
    stroke:  PropTypes.any,
    vectors: PropTypes.any,
    prop2: PropTypes.func,
    prop3: PropTypes.func,
    prop4: PropTypes.func
};