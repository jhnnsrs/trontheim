import _ from "lodash";
import {LinearGradient} from "@vx/gradient";
import React, {Component} from "react"

export class Mask extends Component<{ data: any, meta: any}> {
    render() {
        let {data} = this.props;
        try {
            let stroke;
            let vectors = JSON.parse(data.vectors);
            stroke = "stroke" + data.id;
            return <g key={_.uniqueId()}>
                <LinearGradient id={stroke} from={data.color} to={data.color}/>
            </g>
        } catch (e) {
            return ""
        }
    }
}

export class DrawingMask extends Component<{ data: any, meta: any}> {
    render() {
        let {points, viewerValue} = this.props;
        let scaleFactorX =  1;
        let scaleFactorY =  1;


        try {
            let stroke;
            return <g key={_.uniqueId()}>
                {points.map(point => <rect
                    fill="transparent"
                    stroke="white"
                    width={0.5}
                    height={0.5}
                    x={point.x}
                    y={point.y}
                    style={{pointerEvents: "none"}}
                />)}
                </g>
        } catch (e) {
            return ""
        }
    }
}


export class Reflection extends Component {

    getImageSrc(reflection) {
        if (reflection.data) {
            if (reflection.data.image) {
                // TODO: Should get the path
                return reflection.data.image
            }
            if (reflection.data.shape) {
                let shape = JSON.parse(reflection.data.shape)
                return "http://via.placeholder.com/" + shape[0] + "x" + shape[1]
            }
        }
        else return "http://via.placeholder.com/1024x1024"
    }

    render() {
        return <image href={this.getImageSrc(this.props.reflection)} x="0" y="0"
                      height={this.props.height}
                      width={this.props.width}/>;
    }
}