import {CardImg, CardText} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import type {ReflectionShowStavanger} from "./index";

class ReflectionShow extends Component<any,any> {
    render() {
        const {reflection, data} = this.props;
        if (reflection) {
            return (
                <React.Fragment>
                    <CardText>
                        { reflection && <CardImg src={reflection.image}/>}
                        { data && <small><b>Length </b>{data.physicallength}</small>}<br/>
                        { data && <small><b>DistanceToStart </b>{data.physicaldistancetostart}</small>}<br/>
                    </CardText>
                </React.Fragment>);
        }
        else {
            return ""
        }

    }
}

const mapStavangerToProps = (stavanger: ReflectionShowStavanger) => ({
    reflection: stavanger.reflection.selectors.getData,
    data: stavanger.lengthdata.selectors.getData,
});

const mapStavangerToDispatch  = (stavanger: ReflectionShowStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(ReflectionShow);