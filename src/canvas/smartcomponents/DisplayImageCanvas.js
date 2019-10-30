import React, {Component} from 'react';
import {connect} from 'react-redux';
import {canvas} from '../actions'

import {POSITION_NONE, ReactSVGPanZoom} from 'react-svg-pan-zoom';
import {LinearGradient} from "@vx/gradient";
import {ParentSize} from "@vx/responsive";
import DisplayImage from "./DisplayImage";
import _ from "lodash"
import {DraggingPath} from "./DraggingPath";
import {LineRoi} from "./LineRoi";
import {colorPalette} from "../utils";


class DisplayImageCanvas extends Component {

    constructor(props){
        super(props);
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.mouseMove = this.mouseMove.bind(this);

        this.state = { isDragging: false,
            points: [],
            lastpoint: null,
            threshold: 3,
            drawingpoint: null};

    }


    calculateX(x,offset, scaleFactor) {
        return ( x)
    }

    calculateYDiff(x,dx,offset,scaleFactor) {
        return ( (x + dx))
    }

    mouseUp({point}) {
        point.x = Math.round(point.x);
        point.y = Math.round(point.y);
        this.roiCreated(this.state.points.concat(point))
        this.setState(...this.state, { points: [], lastpoint: null, isDragging: false , drawingpoint: null })

    }

    mouseMove({point}) {

        point.x = Math.round(point.x);
        point.y = Math.round(point.y);
        if (this.state.isDragging) {
            let distance = Math.hypot(point.x - this.state.lastpoint.x, point.y - this.state.lastpoint.y);
            if (distance > this.state.threshold)
                this.setState(...this.state, {points: this.state.points.concat([point]), lastpoint: point, drawingpoint: point});
            else {
                this.setState(...this.state, {drawingpoint: point})
            }
        }

    }

    mouseDown({point}) {

        point.x = Math.round(point.x);
        point.y = Math.round(point.y);
        this.setState(...this.state, { points: [point], lastpoint: point, isDragging: true , drawingpoint: point})

    }


    render() {
        const {
            canvas,
            display,
            rois
        } = this.props;

        const { lastpoint, isDragging, points, drawingpoint} = this.state


        let viewerValue = canvas.viewerValue ? canvas.viewerValue : null;
        let viewerTool = canvas.viewerTool;

        return (
            <ParentSize>
                {parent => {
                    let shape = [1024,1024,3]
                    if (display.data) {
                        if (display.data.shape) {
                            shape = JSON.parse(display.data.shape);
                            parent.height = parent.width * (shape[0]/shape[1]);
                        }
                        else {
                            parent.height = parent.width; // TODO: is this really correct?
                        }
                    }
                    else {
                        parent.height = parent.width; // TODO: is this really correct?
                    }
                    let scaleFactorX = viewerValue ? viewerValue.a: 1;
                    let scaleFactorY = viewerValue ? viewerValue.d: 1;
                    return (
                    <ReactSVGPanZoom
                        width={parent.width} height={parent.height}
                        value={this.props.viewerValue} onChangeValue={value => this.props.setValue(value)}
                        tool={this.props.viewerTool} onChangeTool={tool => this.props.selectTool(tool)}
                        miniaturePosition={POSITION_NONE}
                        onMouseUp={this.mouseUp}
                        onMouseDown={this.mouseDown}
                        onMouseMove={this.mouseMove}
                    >

                        <svg width={shape[0]} height={shape[1]}>


                            <DisplayImage display={display}
                                          parent={parent} width={shape[0]} height={shape[1]}/>


                            {rois.data && rois.data.map(({data}) => {
                                    let stroke;
                                    let vectors = JSON.parse(data.vectors);
                                    stroke = "stroke" + data.id;
                                    return <g key={_.uniqueId()}>
                                        <LinearGradient id={stroke} from={colorPalette(data.creator)} to="#ffdc64"/>
                                        <LineRoi id={data.id} vectors={vectors} stroke={stroke}/>
                                    </g>
                                }
                            )}

                            {isDragging && (
                                <DraggingPath scaleFactorY={scaleFactorY} scaleFactorX={scaleFactorX} x={drawingpoint.x}
                                              y={drawingpoint.y} x1={points[0].x} y1={points[0].y}/>
                            )}
                        </svg>

                    </ReactSVGPanZoom>);
                }}
            </ParentSize>
        );
    }

    roiCreated(points) {
        this.props.postVectors(points)
        
    }
}


const mapStateToProps = state => {
    return {
        canvas: state.canvas.canvas,
        rois: state.canvas.rois,
        display: state.canvas.display
    };
};

const mapDispatchToProps = {
    setValue: canvas.model.setValue.request,
    selectTool: canvas.model.selectTool.request,
    postVectors: (values) => canvas.model.postVectors.request({vectors: values})
};

export default connect(mapStateToProps, mapDispatchToProps)(DisplayImageCanvas);
