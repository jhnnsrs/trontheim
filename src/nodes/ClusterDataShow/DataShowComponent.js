import {CardImg, CardText} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import type {ClusterDataShowStavanger} from "./index";

class DataShowComponent extends Component<any,any> {
    render() {
        const {reflection, data} = this.props;
        if (data) {
            return (
                <React.Fragment>
                        <CardText>
                            { reflection && <CardImg src={reflection.image}/>}
                            { data && <small><b>ClusterNumber </b>{data.clusternumber}</small>}<br/>
                            { data && <small><b>ClusterArea Pixels</b>{data.clusterareapixels}</small>}<br/>
                            { data && <small><b>ClusterArea </b>{data.clusterarea} {data.spatialunit}</small>}<br/>
                        </CardText>
                </React.Fragment>);
        }
        else {
            return ""
        }

    }
}

const mapStavangerToProps = (stavanger: ClusterDataShowStavanger) => ({
    reflection: stavanger.reflection.selectors.getData,
    data: stavanger.data.selectors.getData
});

const mapStavangerToDispatch  = (stavanger: ClusterDataShowStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(DataShowComponent);