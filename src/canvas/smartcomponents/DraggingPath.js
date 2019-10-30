import React, {Component} from "react";
import PropTypes from "prop-types";

export class DraggingPath extends Component {
    render() {
        return <g>
            <rect
                fill="transparent"
                stroke="white"
                strokeWidth={((1 / this.props.scaleFactorY))}
                width={8 * (1 / this.props.scaleFactorX)}
                height={8 * (1 / this.props.scaleFactorY)}
                x={this.props.x - (4 * (1 / this.props.scaleFactorX))}
                y={this.props.y - (4 * (1 / this.props.scaleFactorX))}
                style={{pointerEvents: "none"}}
            />
            <circle
                cx={this.props.x1 - (4 * (1 / this.props.scaleFactorX))}
                cy={this.props.y1 - (4 * (1 / this.props.scaleFactorX))}
                strokeWidth={((1 / this.props.scaleFactorY))}
                r={4 * (1 / this.props.scaleFactorY)}
                fill="white"
                stroke="white"
                style={{pointerEvents: "none"}}
            />
        </g>;
    }
}

DraggingPath.propTypes = {
    scaleFactorY: PropTypes.number,
    scaleFactorX: PropTypes.number,
    x: PropTypes.any,
    y: PropTypes.any,
    x1: PropTypes.any,
    y1: PropTypes.any
};