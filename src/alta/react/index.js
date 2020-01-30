import {combineEpics} from "redux-observable";
import {connect} from "react-redux";
import type {EpicCreator, StavangerCreator} from "../../test/lib/connectors";
import {registerStavangerReducers} from "./ReducerRegistry";
import React from "react";
import _ from "lodash";
import type {Alias} from "../horten/types";
import {combineStavangersToEpic} from "./EpicRegistry";
import {rootStavanger} from "../../rootStavanger";
import {Container} from "reactstrap";
import type {Stavanger} from "../stavanger";
import standardOrchestrator from "./StandardOrchestration";

export const StavangerContext = React.createContext(null);

export const mapBuilder = (mapStavangerToPropsExcecuted) => (state, props) => {

    let list = _.mapValues(mapStavangerToPropsExcecuted, f => f(state,props))
    return list
}


export const WrappedComponent = (CurriedComponent,alias,epic,newStavanger: Stavanger, ensembleStavanger) => {
    // TODO Normal rootStavanger should be set to newStanger.parent here, as new operas should only live in their parents
    // but well fuck my life and so on



    let killEpicMeta = {
        alias: alias,
        end: rootStavanger.epics.model.dynamic(alias + "_END"),
    }

    let registerEpicMeta = (props) => ({
        epic: epic,
        alias: alias,
        pageInit: newStavanger.page.model.initPage.success(props),
        end: rootStavanger.epics.model.dynamic(alias + "_END"),
    })


    class WrappedComponentWrappper extends React.Component {

        componentDidMount(): void {
            let {isRunning, children, registerEpic, killEpic, killPage, ...restProps} = this.props
            this.props.initPage(restProps)
        }

        componentWillUnmount(): void {
            let {isRunning, children, registerEpic, killEpic, killPage, ...restProps} = this.props
            this.props.killPage(restProps)
        }

        render() {
            if (this.props.isRunning) {
                return (
                    <CurriedComponent {...this.props}/>
                );
            }
            else return ("")
        }

    }

    let mapStateToProps = (state) => ({
            isRunning: rootStavanger.epics.selectors.getEpics(state)[alias]
    })


    let mapDispatchToProps = {
        initPage: (props) =>  rootStavanger.epics.model.registerEpic.request(props, registerEpicMeta(props)), // First it registeres the Epics, then it inits the page
        killPage: (props) => newStavanger.page.model.killPage.request(props,killEpicMeta), // First it waits for the Page to be killed
    }

    return connect(mapStateToProps,mapDispatchToProps)(WrappedComponentWrappper)

}


export function getEpicAndRegisterRootStavanger(ensembleStavanger: Stavanger, orchestrator: (Stavanger) => Epic, alias){
    registerStavangerReducers(ensembleStavanger, alias)
    return combineEpics(combineStavangersToEpic(ensembleStavanger, alias),orchestrator(ensembleStavanger))
}



export function connectOpera<T>(stavanger: StavangerCreator<T>) {
    return function (orchestrater: EpicCreator<T>) {
            return function (Component: React.Component<any, any>) {
                return function (alias: Alias, parentstavanger) {

                    let ensembleStavanger: T = stavanger(alias)

                    // Parents are not supposed to be reregister
                    registerStavangerReducers(ensembleStavanger, alias)

                    let rootStavanger = {...ensembleStavanger, parent: parentstavanger}

                    // THIS IS SEPERATING THE BUISNESS LOGIC AND LETS ONLY THE ORCHESTRATER ACCESS ALL THE MODELS
                    // The orchestraters purpose is just redirecting between the stavangernodes and maybe uplifting the request one level higher to its parent
                    // Please refrain from calling the parent of the parent of the parent for readability issues
                    try {
                        const stavangerEnsembleEpics = combineStavangersToEpic(ensembleStavanger, alias)
                        const stavangerOrchestraEpic = orchestrater(rootStavanger)
                        const standardOrchestration = standardOrchestrator(rootStavanger)

                        const combinedEpic = combineEpics(stavangerEnsembleEpics,stavangerOrchestraEpic,standardOrchestration)
                        // Maybe it should also return the epics
                        const Wrapper = WrappedComponent(Component,alias,combinedEpic,rootStavanger, ensembleStavanger)

                        return ((props) =>
                            <StavangerContext.Provider value={rootStavanger}>
                                <Wrapper {...props}/>
                            </StavangerContext.Provider>)
                    }
                    catch (e) {
                        console.log("Failure with Epic ", alias, "| ", e)
                        return ((props) => "")
                    }


                }
            }
        }
};

export function connectInstrument<T>(mapStavangerToProps: ((any, T) => any), mapStavangerToDispatch: ((T) => any)) {
    return function (Component: React.Component<any, any>) {



        return function (props) {
            return (
                <StavangerContext.Consumer>
                    {rootStavanger => {
                        let curriedComponent = Component

                        let mapStateToProps = mapBuilder(mapStavangerToProps(rootStavanger)) //TODO: Implement Here
                        let mapDispatchToProps = mapStavangerToDispatch(rootStavanger) // TODO: Implement Here


                        let Container =  connect(mapStateToProps,mapDispatchToProps)(curriedComponent)
                        return <Container {...props}/>
                    }}
                </StavangerContext.Consumer>);
        }
    }
};




