import {Button, Card, CardBody, CardHeader} from "reactstrap";
import React, {Component} from "react";
import type {ReflectionMaskerStavanger, TwoDShowStavanger} from "./index";
import {connectInstrument} from "../../alta/react";
import {ParentSize} from "@vx/responsive";
import {POSITION_NONE, ReactSVGPanZoom} from "react-svg-pan-zoom";
import _ from "lodash";
import {LinearGradient} from "@vx/gradient";
import {colorPalette} from "../../canvas/utils";
import {LineRoi} from "../../canvas/smartcomponents/LineRoi";
import {DraggingPath} from "../../canvas/smartcomponents/DraggingPath";
import DisplayImage from "../../canvas/smartcomponents/DisplayImage";
import {DrawingMask, Mask, Reflection} from "../../fabric/elements";

export class ReflectionMaskerComponent extends Component<any,any> {

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
        point.x = Math.floor(point.x);
        point.y = Math.floor(point.y);
        this.setState(...this.state, {points: this.state.points.concat([point]), lastpoint: point, drawingpoint: point});

    }

    mouseMove({point}) {

        point.x = Math.round(point.x);
        point.y = Math.round(point.y);
        this.setState(...this.state, {drawingpoint: point})
    }

    mouseDown({point}) {

    }


    render() {
        const {
            fabric,
            reflection,
            masks,
            node,
        } = this.props;

        const { lastpoint, isDragging, points, drawingpoint} = this.state

        if (!fabric) return ""
        let viewerValue = fabric.viewerValue ? fabric.viewerValue : null;
        let viewerTool = fabric.viewerTool;

        return (
                <React.Fragment>
                    <ParentSize>
                        {parent => {
                            if (!reflection.data) return ""

                            let shape = [1,2,3]
                            let canvasheight = 0
                            let canvaswidth = 0

                            let reflectionheight = 0
                            let reflectionwidth = 0


                            if (reflection.data.shape) {
                                shape = JSON.parse(reflection.data.shape);
                                canvasheight = parent.width * (shape[0]/shape[1]);
                                reflectionheight = shape[0]
                                reflectionwidth = shape[1]
                                canvaswidth = parent.width
                            }
                            else {
                                canvasheight = parent.width; // TODO: is this really correct?
                                canvaswidth = parent.width
                            }


                            let scaleFactorX = viewerValue ? viewerValue.a: 1;
                            let scaleFactorY = viewerValue ? viewerValue.d: 1;
                            return (
                                <ReactSVGPanZoom
                                    width={canvaswidth} height={canvasheight}
                                    value={this.props.viewerValue} onChangeValue={value => this.props.setValue(value)}
                                    tool={this.props.viewerTool} onChangeTool={tool => this.props.selectTool(tool)}
                                    miniaturePosition={POSITION_NONE}
                                    onMouseUp={this.mouseUp}
                                    onMouseDown={this.mouseDown}
                                    onMouseMove={this.mouseMove}
                                >
                                    <svg width={reflectionwidth} height={reflectionheight}>


                                        <Reflection reflection={reflection} width={reflectionwidth} height={reflectionheight}/>


                                        <DrawingMask points={this.state.points} viewerValue={viewerValue}/>
                                    </svg>
                                </ReactSVGPanZoom>);
                        }}
                    </ParentSize>
                    <Button onClick={() => this.maskCreated()}> Mask Created </Button>
                    <Button onClick={() => this.maskDumped()}> Mask Dumped </Button>
                </React.Fragment>
        );
    }

    maskCreated() {
        this.props.postVectors({vectors: this.state.points})

    }

    maskDumped() {
        this.setState(...this.state, {points: []})

    }
}

export const mapStavangerToProps = (stavanger: ReflectionMaskerStavanger) => ({
        node: stavanger.edge.selectors.getModel,
        fabric: stavanger.fabric.selectors.getModel,
        masks: stavanger.masks.selectors.getModel,
        reflection: stavanger.reflection.selectors.getModel
    })


export const mapStavangerToDispatch = (stavanger: ReflectionMaskerStavanger) => ({
    setValue: (value) => stavanger.fabric.model.setValue.request(value),
    selectTool: (value) => stavanger.fabric.model.selectTool.request(value),
    postVectors: (vectors) => stavanger.fabric.model.postVectors.request(vectors)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(ReflectionMaskerComponent);
