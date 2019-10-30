import React from 'react';

class LoadAfterProfile extends React.Component {

    render() {
        const {children, user} = this.props;
        return (
            children
        );
    }
}

export default LoadAfterProfile