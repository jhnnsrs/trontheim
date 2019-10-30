import React, {Component} from 'react';

import {Button, Card, CardBody, CardHeader, CardImg, CardImgOverlay, CardText, CardTitle} from "reactstrap";
import Octicon, {ArrowRight, Plus} from "@githubprimer/octicons-react";
import LineRectComponent from "./LineRectComponent";
import NodeFrame from "../lib/NodeFrame";
import Documentation from "./Documentation";
import Container from "../BioMeta";
import {ContainerQuery} from "react-container-query";


let query = {
    "sm": {
        minWidth: 0,
        maxWidth: 110
    },
    "md": {
        minWidth: 111,
        maxWidth: 410
    },
    "bg": {
        minWidth: 411,
    }

}

export const SizesdContext = React.createContext(null)

export const DynamicContainer = (props) =>
    <ContainerQuery query={query}>
        {params =>
            <SizesdContext.Provider value={params}>
                {props.children}
            </SizesdContext.Provider>
        }
    </ContainerQuery>

export class MidConditional extends React.PureComponent<{}> {
    render() {
        return <SizesdContext.Consumer>
            {params => {
                if (params.md) return <div>{this.props.children}</div>
                else return <div></div>
            }
            }
        </SizesdContext.Consumer>;
    }
}

export class BigConditional extends React.PureComponent<{}> {
    render() {
        return <SizesdContext.Consumer>
            {params => {
                if (params.bg) return <div>{this.props.children}</div>
                else return <div></div>
            }
            }
        </SizesdContext.Consumer>;
    }
}

export class SmConditional extends React.PureComponent<{}> {
    render() {
        return <SizesdContext.Consumer>
            {params => {
                if (params.sm) return <div>{this.props.children}</div>
                else return <div></div>
            }
            }
        </SizesdContext.Consumer>;
    }
}

export class MaxISP extends Component {

    constructor(props){
        super(props);

    }


    render() {
                return(
                    <NodeFrame name={"MaxISP"} isGrid={true}>
                        <DynamicContainer>
                            <SmConditional>
                                Halloe
                            </SmConditional>
                            <MidConditional>
                                <LineRectComponent/>
                            </MidConditional>
                            <BigConditional>
                                <LineRectComponent/>
                                <Documentation/>
                            </BigConditional>
                        </DynamicContainer>
                    </NodeFrame>)
    }
}
