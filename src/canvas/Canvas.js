//@flow
import React, {Component} from "react";
import {ParentSize} from "@vx/responsive";
import {POSITION_NONE, ReactSVGPanZoom} from "react-svg-pan-zoom";
import {connectInstrument} from "../alta/react";
import type {Stavanger} from "../alta/stavanger";
import type {HortenCanvas} from "../alta/horten/canvas";
import type {HortenItem} from "../alta/horten/item";

export class Canvas extends Component<any, any> {

    constructor(props) {
        super(props);

        this.state = {
            isDragging: false,
            points: [],
            lastpoint: null,
            threshold: 3,
            drawingpoint: null
        };

    }

    componentDidMount() {
        // Weird Worakround because well i dont now
        document.getElementById('theid').addEventListener('wheel', event => {
            event.preventDefault()
        })
    }


    render() {
        const {canvas, display} = this.props;

        let viewerValue = canvas.viewerValue;
        let viewerTool = canvas.viewerTool;
        let shape = display ? JSON.parse(display.shape) : [1024, 1024]
        return (
            <div id="theid">
                <ParentSize>
                    {parent => {
                        let scaleFactorX = viewerValue ? viewerValue.a : 1;
                        let scaleFactorY = viewerValue ? viewerValue.d : 1;
                        let height = parent.width * (shape[0] / shape[1]);
                        let width = parent.width
                        return (
                            <ReactSVGPanZoom
                                width={width}
                                height={height} tool={viewerTool} onChangeTool={tool => this.props.selectTool(tool)}
                                miniaturePosition={POSITION_NONE}
                                detectAutoPan={false}
                                preventPanOutside={true}
                                detectWheel={this.props.detectWheel}
                            >
                                <svg width={shape[0]} height={shape[1]}>{this.props.children}</svg>

                            </ReactSVGPanZoom>);
                    }}
                </ParentSize>
            </div>
        );
    }

}

export const mapStavangerToProps = (stavanger) => {

    return {
        canvas: stavanger.canvas.selectors.getModel,
        display: stavanger.display.selectors.getData,
    };
};


export const mapStavangerToDispatch = (stavanger) => ({
    setValue: (value) => stavanger.canvas.model.setValue.request(value),
    selectTool: (value) => stavanger.canvas.model.selectTool.request(value),
});

export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Canvas);

class HortenDisplay {
}

export const CanvasCreator = (canvasaccesor: (Stavanger) => HortenCanvas, displayaccesor: (Stavanger) => HortenItem) => {

    const mapStavangerToProps = (stavanger) => ({
        canvas: canvasaccesor(stavanger).selectors.getModel,
        display: displayaccesor(stavanger).selectors.getData,

    });


    const mapStavangerToDispatch = (stavanger) => ({
        setValue: (value) => canvasaccesor(stavanger).model.setValue.request(value),
        selectTool: (value) => canvasaccesor(stavanger).model.selectTool.request(value),
    });


    return connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Canvas);

}