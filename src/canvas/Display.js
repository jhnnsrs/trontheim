import React, {Component} from "react";
import {connectInstrument} from "../alta/react";
import type {Stavanger} from "../alta/stavanger";
import type {HortenItem} from "../alta/horten/item";


class Display extends Component {

    getImageSrc(display) {
        console.log(display)
        if (display) {
            if (display.image) {
                // TODO: Should get the path
                return display.image
            }
            if (display.shape) {
                let shape = JSON.parse(display.shape)
                return "http://via.placeholder.com/" + shape[0] + "x" + shape[1]
            }
        }
        else return "http://via.placeholder.com/1024x1024"
    }

    render() {
        let display = this.props.display
        if (!display) return ""
        let shape = JSON.parse(display.shape)
        let width = shape[0]
        let height = shape[1]

        return <image href={this.getImageSrc(display)} x="0" y="0" height={height} width={width}/>;
    }
}

export const mapStavangerToProps = (stavanger) => ({
        display: stavanger.display.selectors.getData,
    });


export const mapStavangerToDispatch = (stavanger) => ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Display);


export const DisplayCreator = (accesor: (Stavanger) => HortenItem) => {

    const mapStavangerToProps = (stavanger) => ({
        display: accesor(stavanger).selectors.getData,
    });


    const mapStavangerToDispatch = (stavanger) => ({
    });


    return connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Display);

}
