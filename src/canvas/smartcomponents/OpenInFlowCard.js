import React, {Component} from "react";
import {Button, Card, CardText, CardTitle} from "reactstrap";
import {push} from "react-router-redux";
import connect from "react-redux/es/connect/connect";

class OpenInFlowCard extends Component {

    render() {
        const {push, displayid} = this.props;
        return (
            <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333' }} className="mt-2">
                <CardTitle>Open in Flow</CardTitle>
                <CardText>This File has been associated with a flow.</CardText>
                <Button outline color={"light"} onClick={() => push("/trontheim/flow/"+displayid)}>Open in AIFlow</Button>
            </Card>);
    }
}

const mapStateToProps = (state,props) => {
    return {
        displayid: props.displayid,
    };
};

const mapDispatchToProps = {
    push: (location) => push(location)
};

export default connect(mapStateToProps, mapDispatchToProps)(OpenInFlowCard);