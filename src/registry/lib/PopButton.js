import {Button} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import type {NodeStavanger} from "./types";
import {THIS_ROOT_URL} from "../../constants/endpoints";
import {withRouter} from "react-router-dom";
import styled from 'styled-components';
import Octicon, {Project, Zap} from '@githubprimer/octicons-react'

const Popper = styled.div`
  color: ${props => props.color || "black"};
  border-radius: 1;
  border: 0;
  cursor: pointer;
  background-color: transparent;
`;



const PopLinkComponent = (props) =>
    <Popper color={props.color} onClick={() => {
                                          window.open(props.to, "_blank", "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=700,height=700")
                                          return false
                                      }}>
        {props.children}
    </Popper>;



const PopLink = withRouter(PopLinkComponent);

class StartButton extends Component<any,any> {
    render() {
        let type = this.props.type
        console.log("rerendered")
        return (
            <React.Fragment>
                {(type.location === "local") && <Popper size="sm" outline onClick={() => this.props.start()}><Octicon icon={Project}/> </Popper>}
                {(type.location === "pop") && <>
                        <PopLink outside={true} to={THIS_ROOT_URL + "/external/" + type.external}>{type.external}</PopLink>
                    </>}
                {(type.location === "external") && ""}
            </React.Fragment>
        );
    }
}

const mapStavangerToProps = (stavanger: NodeStavanger) => ({
    type: stavanger.parent.graph.selectors.getNodeType(stavanger.node.alias),
    node: stavanger.node.selectors.getModel
});

const mapStavangerToDispatch  = (stavanger: NodeStavanger) =>  ({
    start: () => stavanger.node.model.pop.request(),
    unpop: () => stavanger.node.model.unpop.request(),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(StartButton);