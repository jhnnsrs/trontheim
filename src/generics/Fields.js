import {Button, FormGroup, FormText, Input, InputGroup, InputGroupAddon, Label} from "reactstrap";
import React from "react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';


export const renderInputField = ({input, label, placeholder, type, meta: {touched, error}, ...custom}) => {
    return (
        <FormGroup>
            <InputGroup>
                <InputGroupAddon addonType="prepend">{label}</InputGroupAddon>
                <Input type={type} name="email" id="exampleEmail" placeholder={placeholder} {...input}/>
            </InputGroup>
        </FormGroup>
    )
}

export const renderCheckInput = ({input, label, truevalue, falsevalue, colorcode, placeholder, description, type, meta: {touched, error}, ...custom}) => {

    return (
        <FormGroup>
            <InputGroup>
                <InputGroupAddon addonType="prepend">{label}</InputGroupAddon>
                <Button color={colorcode ? (input.value? "success" : "danger") : null} onClick={() => input.onChange(!input.value)}>{input.value  ? truevalue : falsevalue }</Button>
            </InputGroup>
            {description && <FormText color="muted">
                {description}
            </FormText>}
        </FormGroup>
    )
}


export const renderTextField = ({input, label, placeholder, type, description,meta: {touched, error}, ...custom}) => {
    return (
        <FormGroup>
            <FormGroup>
                <Label for="exampleText">{label}</Label>
                <Input type="textarea" name="text" id="exampleText" placeholder={placeholder} {...input}/>
            </FormGroup>
            {description && <FormText color="muted">
                {description}
            </FormText>}
        </FormGroup>
    )

}
export const renderFileField = ({input, label, placeholder, type, meta: {touched, error}, ...custom}) => {
    return (
        <FormGroup>
            <Label for="exampleFile">File</Label>
            <Input type="file" name="file" id="exampleFile"
                   onChange={
                       (e) => {
                           e.preventDefault();
                           const files = [...e.target.files];
                           input.onChange(files);
                       }
                   }/>
            <FormText color="muted">
                This is some placeholder block-level help text for the above input.
                It's a bit lighter and easily wraps to a new line.
            </FormText>
        </FormGroup>
    )
}

const animatedComponents = makeAnimated();

export const renderMultiSelectBuilder = (options) =>  ({input, label, placeholder, type, description, meta: {touched, error, initial}, ...custom}) => {

    let selectoptions = options.map( option => ({value: option, label: `${option[0].toUpperCase()}${option.slice(1).toLowerCase()}`}))

    return (
        <FormGroup>
            <Label for="multiSelection">{label}</Label>
            <Select
                defaultValue={initial}
                value={input.value}
                isMulti
                onChange={ (selectedOption) => input.onChange(selectedOption)}
                options={selectoptions}
                className="basic-multi-select"
                classNamePrefix="select"
                id="multiSelection"
            />
            <FormText color="muted">
                {description && description}
            </FormText>
        </FormGroup>
    )
}

export const renderMultiSelect = (options: [{value: any, label: string}]) =>  ({input, label, placeholder, type, description, meta: {touched, error, initial}, ...custom}) => {

    let selectoptions = options

    return (
        <FormGroup>
            <Label for="multiSelection">{label}</Label>
            <Select
                defaultValue={initial}
                value={input.value}
                isMulti
                onChange={ (selectedOption) => input.onChange(selectedOption)}
                options={selectoptions}
                className="basic-multi-select"
                classNamePrefix="select"
                id="multiSelection"
            />
            <FormText color="muted">
                {description && description}
            </FormText>
        </FormGroup>
    )
}

export const renderSingleSelectBuilder = (options) =>  ({input, label, placeholder, type, description, meta: {touched, error, initial}, ...custom}) => {

    let selectoptions = options.map( option => ({value: option, label: `${option[0].toUpperCase()}${option.slice(1).toLowerCase()}`}))

    return (
        <FormGroup>
            <Label for="multiSelection">{label}</Label>
            <Select
                defaultValue={initial}
                value={input.value}
                onChange={ (selectedOption) => input.onChange(selectedOption)}
                options={selectoptions}
                className="basic-multi-select"
                classNamePrefix="select"
                id="multiSelection"
            />
            <FormText color="muted">
                {description && description}
            </FormText>
        </FormGroup>
    )
}