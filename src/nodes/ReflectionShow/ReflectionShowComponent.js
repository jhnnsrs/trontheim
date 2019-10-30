import {Button, ButtonGroup, Card, CardBody, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import type {DataShowStavanger, ReflectionShowStavanger} from "./index";

class ReflectionShowComponent extends Component<any,any> {
    render() {
        const {reflection} = this.props;
        if (reflection.data) {
            return (
                <React.Fragment>
                        <CardText>
                            <CardImg src={reflection.data.image}/>
                        </CardText>
                </React.Fragment>);
        }
        else {
            return ""
        }

    }
}

const mapStavangerToProps = (stavanger: ReflectionShowStavanger) => ({
    reflection: stavanger.reflection.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: ReflectionShowStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(ReflectionShowComponent);