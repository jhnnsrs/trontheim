import {Component} from "react";
import React from "react";
import {Button, Card, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import Octicon,{Plus} from "@githubprimer/octicons-react";
import connect from "react-redux/es/connect/connect";
import * as sta from "../actions"

class RepresentationDetailCard extends Component {

    render() {

        const {representation} = this.props;
        return (
                representation != null ?
                    <Card inverse className="mt-2 overflow">
                    <CardImg top width="100%" src={"../images/samples.jpeg"}
                alt="Card image cap"/>
                    <CardImgOverlay className="blur">
                    <CardTitle>{representation.name}</CardTitle>
            <CardText>
                <small>{representation.vid}</small>
            </CardText>
                <CardText>
                    <Button size="sm" outline color="light" onClick={this.toggle}><Octicon icon={Plus} ariaLabel="Add new item"/> Add
                        Flow</Button>
                </CardText>
                </CardImgOverlay>
            </Card> : "");
    }
}


const mapStateToProps = state => ({
    representation: state.canvas.representation.data,
    display: state.canvas.display.data
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(RepresentationDetailCard);