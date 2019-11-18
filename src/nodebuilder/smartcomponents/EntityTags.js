import React, {Component} from 'react';
import {connect} from 'react-redux';
import '../style.css';
import {requestSuggets, setSelected} from "../actions";
import {WithContext as ReactTags} from 'react-tag-input';


const KeyCodes = {
    comma: 188,
    enter: 13,
    tab: 9
};
const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.tab];

class TagsAutoComplete extends Component {
    constructor(props) {
        super(props);

        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleTagClick = this.handleTagClick.bind(this);
    }

    handleDelete(i) {
        const tags = this.props.selected;
        this.props.setSelected(tags.filter((tag, index) => index !== i));
    }

    handleAddition(tag) {
        this.props.setSelected([...this.props.selected, tag]);
    }

    handleDrag(tag, currPos, newPos) {
        const tags = [...this.props.selected];
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        // re-render
        this.props.setSelected(newTags);
    }

    handleTagClick(index) {
        console.log('The tag at index ' + index + ' was clicked');
    }

    render() {
        const { selected, options, getOptions } = this.props;
        return (
            <div>
                <ReactTags
                    tags={selected}
                    suggestions={options}
                    delimiters={delimiters}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag}
                    handleInputChange={getOptions}
                    handleTagClick={this.handleTagClick}
                    minQueryLength={1}
                />
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        selected: state.sampleselector.sampleSelectorReducer.selected,
        options: state.sampleselector.sampleSelectorReducer.options,
    };
};

const mapDispatchToProps = {
    setSelected: (values) => setSelected(values),
    getOptions: (term) => requestSuggets(term),
};

export default connect(mapStateToProps, mapDispatchToProps)(TagsAutoComplete);
