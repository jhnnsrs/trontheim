//@flow
import {Button, Card, CardBody, CardHeader} from "reactstrap";
import React, {Component} from "react";
import type {RoiShowStavanger} from "./index";
import {connectInstrument} from "../../alta/react";
import {ParentSize} from "@vx/responsive";
import {POSITION_NONE, ReactSVGPanZoom} from "react-svg-pan-zoom";
import _ from "lodash";
import {LinearGradient} from "@vx/gradient";
import {colorPalette} from "../../canvas/utils";
import {DraggingPath} from "../../canvas/smartcomponents/DraggingPath";
import DisplayImage from "../../canvas/smartcomponents/DisplayImage";
import {LineRoi} from "../../fabric/LineRoi";
import Rois from "./Rois";

export class TwoDShowComponent extends Component<any,any> {

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

    componentDidMount() {
        // Weird Worakround because well i dont now
        document.getElementById('theid').addEventListener('wheel', event => {
            event.preventDefault()
        })
    }


    calculateX(x,offset, scaleFactor) {
        return ( x)
    }

    calculateYDiff(x,dx,offset,scaleFactor) {
        return ( (x + dx))
    }

    mouseUp({point}) {
        if (!this.props.drawState) return
        point.x = Math.round(point.x);
        point.y = Math.round(point.y);
        this.roiCreated(this.state.points.concat(point))
        this.setState(...this.state, { points: [], lastpoint: null, isDragging: false , drawingpoint: null })

    }


    mouseMove({point}) {
        if (!this.props.drawState) return
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
        if (!this.props.drawState) return
        point.x = Math.round(point.x);
        point.y = Math.round(point.y);
        this.setState(...this.state, { points: [point], lastpoint: point, isDragging: true , drawingpoint: point})

    }


    render() {
        const {canvas, display,} = this.props;

        const { lastpoint, isDragging, points, drawingpoint} = this.state


        let viewerValue = canvas.viewerValue ? canvas.viewerValue : null;
        let viewerTool = canvas.viewerTool;

        return (
                <div id="theid">
                    <ParentSize>
                        {parent => {
                            if (!display.data) return ""
                            let shape = [1024,1024,2]
                            if (display) {
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


                                        <Rois/>

                                        {isDragging && (
                                            <DraggingPath scaleFactorY={scaleFactorY} scaleFactorX={scaleFactorX} x={drawingpoint.x}
                                                          y={drawingpoint.y} x1={points[0].x} y1={points[0].y}/>
                                        )}
                                    </svg>

                                </ReactSVGPanZoom>);
                        }}
                    </ParentSize>
                </div>
        );
    }

    roiCreated(points) {
        this.props.postVectors({vectors: points})

    }
}

export const mapStavangerToProps = (stavanger: RoiShowStavanger) => {

    return {
        node: stavanger.edge.selectors.getModel,
        canvas: stavanger.canvas.selectors.getModel,
        display: stavanger.display.selectors.getModel,
    };
};


export const mapStavangerToDispatch = (stavanger: RoiShowStavanger) => ({
    setValue: (value) => stavanger.canvas.model.setValue.request(value),
    selectTool: (value) => stavanger.canvas.model.selectTool.request(value),
    postVectors: (vectors) => stavanger.canvas.model.postVectors.request(vectors)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(TwoDShowComponent);
