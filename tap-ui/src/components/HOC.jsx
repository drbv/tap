import React from 'react';

import {Context} from './Provider';

const withProps = (WrappedComponent) => {


    /**
     * this is the withSense HOC, it injects global objects into Component props
     */
    class HOC extends React.Component {

        constructor(props) {
            super(props);
        }

        render() {
            return (
                <Context.Consumer>
                    {context => <WrappedComponent {...context} {...this.props}/>}
                </Context.Consumer>
            );
        }
    }

    return HOC;
};

export default withProps;
