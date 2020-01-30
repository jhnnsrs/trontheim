import {mapBuilder, StavangerContext} from "./index";
import React, {Component} from "react";
import {Form, reduxForm} from "redux-form";
import {connect} from "react-redux";
import type {HortenForm} from "../horten/form";


export type FormProps = {
    formHorten: string,
    enableReinitialize: boolean
}

class FormComponent extends Component<FormProps,any> {

    componentDidMount(): void {
        this.props.initializeForm(this.props)
    }

    componentWillUnmount(): void {
        this.props.destroyForm()
    }


    render() {
        const { handleSubmit, load, pristine, reset, submitting, dispatch ,sta } = this.props
        return (
            <Form onSubmit={handleSubmit(values => this.props.formHorten.helpers.onSubmit(values, dispatch))}>
                {this.props.children}
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
    destroyForm: () => formHorten.model.destroyed.request()
});



export function connectForm<T>(Component: React.Component<any, any>) {
        return function (props) {
            return (
                <StavangerContext.Consumer>
                    {rootStavanger => {
                        let curriedComponent = reduxForm({
                            form: rootStavanger[props.formHorten].model.alias.toLowerCase() + "-" + props.formHorten, // a unique identifier for this form
                        })(Component)

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