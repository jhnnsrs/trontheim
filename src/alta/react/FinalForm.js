//@flow

import {mapBuilder, StavangerContext} from "./index";
import React, {Component} from "react";
import {Form} from 'react-final-form'
import {connect} from "react-redux";
import type {HortenForm} from "../horten/form";


export type FormProps = {
    formHorten: string,
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
            <Form onSubmit={(values) => this.props.submitForm(values)}
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

const mapHortenFormToProps = (formHorten: HortenForm, enableReinitialize) => ({
    formHorten: (state,props) => formHorten,
    enableReinitialize: (state,props) => enableReinitialize,
    initialValues: formHorten.selectors.getInitial,
});


const mapStavangerToDispatch  = (formHorten: HortenForm) =>  ({
    initializeForm: (props) => formHorten.model.initialized.request(props),
    submitForm: (values) => formHorten.model.submitForm.request(values),
    destroyForm: () => formHorten.model.destroyed.request()
});



export function connectForm<T>(Component: React.Component<any, any>) {
        return function (props) {
            return (
                <StavangerContext.Consumer>
                    {rootStavanger => {
                        let curriedComponent = Component

                        console.log("Creating Updated Form with ID ",  props.formHorten)
                        console.log("Setting Reinitialize to ",  props.enableRe)

                        let mapStateToProps = mapBuilder(mapHortenFormToProps(rootStavanger[props.formHorten],props.enableRe)) //TODO: Implement Here
                        let mapDispatchToProps = mapStavangerToDispatch(rootStavanger[props.formHorten]) // TODO: Implement Here


                        let Container =  connect(mapStateToProps,mapDispatchToProps)(curriedComponent)
                        return <Container {...props}/>
                    }}
                </StavangerContext.Consumer>);
        }
};


export default connectForm(FormComponent);