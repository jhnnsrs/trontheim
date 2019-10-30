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
        console.log("loaded new "+nodeid)
        let container = m.default(nodeid, rootstavanger);
        return container
    }).catch(e => console.log(e)),
    loading: Loading
});

export const NodeLazyAsyncContainer = (nodeid, path, rootstavanger = rootStavanger) =>
    React.lazy(() => import("../../nodes/" + path).then(m => {
        console.log("loaded new "+nodeid)
        let container = m.default(nodeid, rootstavanger);
        return { default: container}
    }).catch(e => console.log(e)))


export const NodeTestContainer = (props) =>
    <StavangerContext.Consumer>
        {parentStavanger => {
            console.log("Calleleilinelin")
            let NanaContainer = NodeLazyAsyncContainer(props.node.nodeid, props.node.path, parentStavanger)
            let newprops = {...props, nodeid: props.node.nodeid, base: props.node.id}

            return <React.Suspense fallback={<Loading />}>
                <NanaContainer {...newprops} />
            </React.Suspense>

        }}
    </StavangerContext.Consumer>

export const NodeContainer = (props) =>
    <StavangerContext.Consumer>
        {parentStavanger => {
            console.log("Calleleilinelin")
            let NanaContainer = NodeTestAsyncContainer(props.node.nodeid, props.node.path, parentStavanger)
            let newprops = {...props, nodeid: props.node.nodeid, base: props.node.id}


            return <NanaContainer {...newprops} />
        }}
    </StavangerContext.Consumer>


export type Opera = (Alias, Stavanger) => React.Component;

export const OperaHost = (opera: Opera, alias: Alias) => (props) =>
    <StavangerContext.Consumer>
        {parentStavanger => {
            console.log("CALLED")
            let NanaContainer = opera(alias, parentStavanger)
            return <NanaContainer {...props}/>
        }}
    </StavangerContext.Consumer>