import {mapBuilder, StavangerContext} from "./index";
import React, {Component}from "react";
import {Form} from 'react-final-form'
import {connect} from "react-redux";
import type {HortenMold} from "../horten/mold";


export type FormProps = {
    mold: string,
    enableRe: boolean
}

class FormComponent extends Component<FormProps,any> {

    componentDidMount(): void {
        this.props.initializeForm(this.props)
    }

    componentWillUnmount(): void {
        this.props.destroyForm()
    }


    render() {
        return (
            <Form
                onSubmit={(values) => this.props.submitForm(values)}
                initialValues={this.props.initialValues}
                render={(props) => {
                    return (<form onSubmit={props.handleSubmit}>
                        {this.props.children(props)}
                    </form>)
                }}>
            </Form>
        );
    }
}

const mapHortenMoldToProps = (moldHorten: HortenMold, enableReinitialize) => ({
    formHorten: (state,props) => moldHorten,
    enableReinitialize: (state,props) => enableReinitialize,
    initialValues: moldHorten.selectors.getInitial,
});


const mapStavangerToDispatch  = (moldHorten: HortenMold) =>  ({
    initializeForm: (props) => moldHorten.model.initialized.request(props),
    submitForm: (values) => moldHorten.model.submitForm.request(values),
    destroyForm: () => moldHorten.model.destroyed.request()
});



export function connectMold<T>(Component: React.Component<any, any>) {
        return function (props: {mold: string, enableRe: boolean}) {
            return (
                <StavangerContext.Consumer>
                    {rootStavanger => {
                        let curriedComponent = Component

                        console.log("Creating Updated Mold with ID ",  props.mold)
                        console.log("Setting Reinitialize to ",  props.enableRe)

                        let mapStateToProps = mapBuilder(mapHortenMoldToProps(rootStavanger[props.mold],props.enableRe)) //TODO: Implement Here
                        let mapDispatchToProps = mapStavangerToDispatch(rootStavanger[props.mold]) // TODO: Implement Here


                        let Container =  connect(mapStateToProps,mapDispatchToProps)(curriedComponent)
                        return <Container {...props}/>
                    }}
                </StavangerContext.Consumer>);
        }
};


export default connectMold(FormComponent);