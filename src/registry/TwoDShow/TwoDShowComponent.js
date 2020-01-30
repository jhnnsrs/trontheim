//@flow
import React, {Component} from "react";
import type {TwoDShowStavanger} from "./index";
import {connectInstrument} from "../../alta/react";
import {ParentSize} from "@vx/responsive";
import {POSITION_RIGHT, ReactSVGPanZoom} from "react-svg-pan-zoom";
import {LineRoi} from "../../fabric/LineRoi";
import {DraggingPath} from "../../canvas/smartcomponents/DraggingPath";
import DisplayImage from "../../canvas/smartcomponents/DisplayImage";

export class TwoDShowComponent extends Component<any,any> {

    constructor(props){
        super(props);
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.touchStart = this.touchStart.bind(this);
        this.touchMove = this.touchMove.bind(this);
        this.touchEnd = this.touchEnd.bind(this);

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
        point.x = Math.round(point.x);
        point.y = Math.round(point.y);
        this.roiCreated(this.state.points.concat(point))
        this.setState({...this.state,  points: [], lastpoint: null, isDragging: false , drawingpoint: null })

    }

    touchEnd({points}) {

        let point = points[0]

        console.log("END",points)
        this.roiCreated(this.state.points)
        this.setState({...this.state, points: [], lastpoint: null, isDragging: false , drawingpoint: null })

    }


    mouseMove({point}) {

        point.x = Math.round(point.x);
        point.y = Math.round(point.y);
        if (this.state.isDragging) {
            let distance = Math.hypot(point.x - this.state.lastpoint.x, point.y - this.state.lastpoint.y);
            if (distance > this.state.threshold)
                this.setState({...this.state, points: this.state.points.concat([point]), lastpoint: point, drawingpoint: point});
            else {
                this.setState({...this.state, drawingpoint: point})
            }
        }

    }

    touchMove({points}) {
        let point = points[0]

        console.log("MOVE",points)

        point.x = Math.round(point.x);
        point.y = Math.round(point.y);
        if (this.state.isDragging) {
            let distance = Math.hypot(point.x - this.state.lastpoint.x, point.y - this.state.lastpoint.y);
            if (distance > this.state.threshold)
                this.setState({...this.state, points: this.state.points.concat([point]), lastpoint: point, drawingpoint: point});
            else {
                this.setState({...this.state, drawingpoint: point})
            }
        }

    }

    mouseDown({point}) {

        point.x = Math.round(point.x);
        point.y = Math.round(point.y);
        this.setState({...this.state, points: [point], lastpoint: point, isDragging: true , drawingpoint: point})

    }

    touchStart({points}) {
        let point = points[0]
        console.log("START",points)

        point.x = Math.round(point.x);
        point.y = Math.round(point.y);
        this.setState({...this.state, points: [point], lastpoint: point, isDragging: true , drawingpoint: point})

    }

    render() {
        const {
            canvas,
            display,
            rois,
        } = this.props;

        const { lastpoint, isDragging, points, drawingpoint} = this.state


        let viewerValue = canvas.viewerValue ? canvas.viewerValue : null;
        let viewerTool = canvas.viewerTool;
        return (
                <div id="theid">
                    <ParentSize>
                        {parent => {
                            if (!display.data) return "Waiting for Initial Input"
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
                            console.log(shape)
                            return (
                                <ReactSVGPanZoom
                                    width={parent.width} height={parent.height}
                                    value={this.props.viewerValue} onChangeValue={value => this.props.setValue(value)}
                                    tool={this.props.viewerTool} onChangeTool={tool => this.props.selectTool(tool)}
                                    miniaturePosition={POSITION_RIGHT}
                                    onMouseUp={this.mouseUp}
                                    onMouseMove={this.mouseMove}
                                    onMouseDown={this.mouseDown}
                                >
                                    <svg width={shape[0]} height={shape[1]}>


                                        <DisplayImage display={display}
                                                      parent={parent} width={shape[0]} height={shape[1]}/>


                                        {rois.data && rois.data.map( roi => <LineRoi key={roi.data.id} roi={roi}/>)}

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

export const mapStavangerToProps = (stavanger: TwoDShowStavanger) => {

    return {
        node: stavanger.node.selectors.getModel,
        canvas: stavanger.canvas.selectors.getModel,
        rois: stavanger.rois.selectors.getModel,
        display: stavanger.displayedDisplay.selectors.getModel,
    };
};


export const mapStavangerToDispatch = (stavanger: TwoDShowStavanger) => ({
    setValue: (value) => stavanger.canvas.model.setValue.request(value),
    selectTool: (value) => stavanger.canvas.model.selectTool.request(value),
    postVectors: (vectors) => stavanger.canvas.model.postVectors.request(vectors)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(TwoDShowComponent);
