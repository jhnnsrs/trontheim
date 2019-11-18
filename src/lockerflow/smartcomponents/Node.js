import {StavangerContext} from "../../alta/react";
import React from "react";
import {rootStavanger} from "../../rootStavanger";

const Loading = (props) => <div> Loading</div>

export const AsyncStavanger = (nodeid, path, rootstavanger = rootStavanger) =>
    React.lazy(() => import("../../registry/" + path).then(m => {
        console.log("loaded new "+nodeid)
        let container = m.default(nodeid, rootstavanger);
        return { default: container}
    }).catch(e => console.log(e)))



const Node = (props) =>
    <StavangerContext.Consumer>
        {parentStavanger => {
            console.log("Node Called")
            let NanaContainer = AsyncStavanger(props.instance, props.path, parentStavanger)
            let newprops = {...props}

            return <React.Suspense fallback={<Loading />}>
                <NanaContainer {...newprops}/>
            </React.Suspense>

        }}
    </StavangerContext.Consumer>



export default Node