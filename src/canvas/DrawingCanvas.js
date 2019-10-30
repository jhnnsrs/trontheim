//@flow
import React, {Component} from "react";
import {ParentSize} from "@vx/responsive";
import {POSITION_NONE, ReactSVGPanZoom} from "react-svg-pan-zoom";
import {DraggingPath} from "/smartcomponents/DraggingPath";
import {connectInstrument} from "../alta/react";
import type {Stavanger} from "../alta/stavanger";
import type {HortenTable} from "../alta/horten/table";
import type {HortenCanvas} from "../alta/horten/canvas";

export class DrawingCanvas extends Component<any,any> {

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
        const {canvas} = this.props;

        const { isDragging, points, drawingpoint} = this.state


        let viewerValue = canvas.viewerValue;
        let viewerTool = canvas.viewerTool;

        return (
            <div id="theid">
                <ParentSize>
                    {parent => {
                        let scaleFactorX = viewerValue ? viewerValue.a: 1;
                        let scaleFactorY = viewerValue ? viewerValue.d: 1;
                        return (
                            <ReactSVGPanZoom
                                width={parent.width} height={parent.height}
                                value={viewerValue} onChangeValue={value => this.props.setValue(value)}
                                tool={viewerTool} onChangeTool={tool => this.props.selectTool(tool)}
                                miniaturePosition={POSITION_NONE}
                                onMouseUp={this.mouseUp}
                                onMouseDown={this.mouseDown}
                                onMouseMove={this.mouseMove}
                            >
                                <svg width={parent.width} height={parent.height}>
                                    {this.props.children}
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

export const mapStavangerToProps = (stavanger) => {

    return {
        canvas: stavanger.canvas.selectors.getModel,
    };
};


export const mapStavangerToDispatch = (stavanger) => ({
    setValue: (value) => stavanger.canvas.model.setValue.request(value),
    selectTool: (value) => stavanger.canvas.model.selectTool.request(value),
    postVectors: (vectors) => stavanger.canvas.model.postVectors.request(vectors)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(DrawingCanvas);

export const DrawingCanvasCreator = (accesor: (Stavanger) => HortenCanvas) => {

    const mapStavangerToProps = (stavanger) => ({
        canvas: accesor(stavanger).selectors.getModel,
    });


    const mapStavangerToDispatch = (stavanger) => ({
        setValue: (value) => accesor(stavanger).model.setValue.request(value),
        selectTool: (value) => accesor(stavanger).model.selectTool.request(value),
        postVectors: (vectors) => accesor(stavanger).model.postVectors.request(vectors)
    });


    return connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(DrawingCanvas);

}