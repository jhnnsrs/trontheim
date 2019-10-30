import {rootStavanger} from "../../rootStavanger";
import Loadable from "react-loadable";
import React from "react";
import {StavangerContext} from "./index";
import type {Alias} from "../horten/types";
import type {Stavanger} from "../stavanger";
import v4 from "uuid"

const Loading = (props) => <div> Loading</div>

export const NodeTestAsyncContainer = (nodeid, path, rootstavanger = rootStavanger,) => Loadable({
    loader: () => import("../../nodes/" + path).then(m => {
        let container = m.default(nodeid, rootstavanger);
        return container
    }).catch(e => console.log(e)),
    loading: Loading
});


export const NodeTestContainer = (props) =>
    <StavangerContext.Consumer>
        {parentStavanger => {

            let NanaContainer = NodeTestAsyncContainer(props.node.nodeid, props.node.path, parentStavanger)
            let newprops = {...props, nodeid: props.node.nodeid, base: props.node.id}


            return <NanaContainer {...newprops} />
        }}
    </StavangerContext.Consumer>


export type Opera = (Alias, Stavanger) => React.Component;

export const OperaHost = (opera: Opera, alias: Alias) => (props) =>
    <StavangerContext.Consumer>
        {parentStavanger => {
            let NanaContainer = opera(alias, parentStavanger)
            return <NanaContainer {...props}/>
        }}
    </StavangerContext.Consumer>