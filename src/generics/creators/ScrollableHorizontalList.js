import React, {Component} from "react";
import {connectInstrument} from "../../alta/react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import type {HortenTable} from "../../alta/horten/table";
import type {Stavanger} from "../../alta/stavanger";


function value_limit(num, max) {
    if (num > max) {
        return max
    } else {
        return num;
    }
}


class ScrollableHorizontalList extends Component {

    render() {
        const {list, deleteItem, selectItem, maxItems, minItems} = this.props
        if (list == null) {
            return ""
        }
        let length = list.length > 0 ? value_limit(list.length, maxItems ? maxItems : 5) : 1;

        console.log(length)
        const settings = {

            swipeToSlide: true,
            dots: true,
            infinite: false,
            speed: 500,
            slidesToShow: length,
            slidesToScroll: 1,
            variableWidth: false
        };


        if (list) {
            return (
                <Slider{...settings}>
                    {list.map((item, key) =>
                        this.props.children(item, key, selectItem, deleteItem))}
                </Slider>);
        } else {
            return ""
        }
    }
}


export const ScrollabeHorizontalListCreator = (accesor: (Stavanger) => HortenTable) => {

    const mapStavangerToProps = (stavanger) => ({
        list: accesor(stavanger).selectors.getList,
    });

    const mapStavangerToDispatch = (stavanger) => ({
        deleteItem: (item) => accesor(stavanger).model.deleteItem.request(item),
        selectItem: (item) => accesor(stavanger).model.selectItem.request(item),
    });


    return connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(ScrollableHorizontalList);

}