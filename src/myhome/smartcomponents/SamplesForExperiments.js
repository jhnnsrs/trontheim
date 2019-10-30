import React, {Component} from "react";
import type {HomeStavanger} from "../stavanger";
import {Button, ButtonGroup, Card, CardImg, CardImgOverlay, CardText, CardTitle, Col, Container, Row} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import ButtonToNavigate from "../../generics/ButtonToNavigate";
import Slider from "react-slick";
import Octicon, {Heart, Plus, X} from "@githubprimer/octicons-react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class SamplesForExperiments extends Component {

    getImageHref(sample) {
        // Displaying last created data
        let display = this.props.displays.data.find(item => item.data.sample == sample.data.id)
        if (display) {
            return display.data.image ? display.data.image : "http://via.placeholder.com/1024x1024/000000/ffffff"
        }
        return "http://via.placeholder.com/1024x1024/000000/ffffff"
    }

    value_limit(num, min, max) {
        if (num < min) return min
        else if ( num > max) return max
        else return num;
    }

    render() {
        const {samples, flows} = this.props;
        const {experiment} = this.props.ownProps;

        let filteredsamples = samples.data.filter(item => item.data.experiment === experiment.data.id)
        let length = filteredsamples.length > 0 ? this.value_limit(filteredsamples.length,1,5) : 1;

        const settings = {

            swipeToSlide: true,
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: length,
            slidesToScroll: 1,
            variableWidth: false
        };


        if (filteredsamples) {
            return (
                <Slider{...settings}>
                    {filteredsamples.map( (sample, key) =>
                        <Card inverse className="mt-2 text-right text-light-50" style="border-color: #333;" key={sample.data.id}>
                            <CardImg top width="100%" src={this.getImageHref(sample)} className="overflow"
                                     alt="Card image cap"/>
                            <CardImgOverlay className="blur">
                                <ButtonGroup>
                                    <Button outline size="sm" color={"light"} className="d-none d-lg-block"><Octicon icon={Plus} ariaLabel="Add new item"/></Button>
                                    <ButtonToNavigate outline size="sm" color={"light"} to={"/sample/"+sample.data.id}><Octicon icon={Heart} ariaLabel="Open"/></ButtonToNavigate>
                                    <Button outline size="sm" color={"danger"} onClick={() => this.props.deleteSample(sample)}><Octicon icon={X} ariaLabel="Delete"/></Button>
                                </ButtonGroup>
                            </CardImgOverlay>
                        </Card>)
                    }
                </Slider>);
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: HomeStavanger) => ({
    samples: stavanger.samples.selectors.getModel,
    displays: stavanger.displays.selectors.getModel,
    ownProps: stavanger.samples.selectors.getProps
});

const mapStavangerToDispatch  = (stavanger: HomeStavanger) =>  ({
    deleteSample: (sample) => stavanger.samples.model.deleteItem.request(sample)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(SamplesForExperiments);
