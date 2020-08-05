import React, { Component, lazy, Fragment } from "react";
// import Footer from "../Containers/Footer";

const Global = lazy(() =>
    import(/* webpackChunkName: "Global"*/ "./Global")
);

const Auth = lazy(() =>
    import(/* webpackChunkName: "Auth"*/ "../Containers/Auth")
);

export default class Routes extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const { getInitialData } = this.props;
        getInitialData();
    }

    render() {
        const { authenticated, unauthorizedError } = this.props;
        // if (authenticated !== true && authenticated !== false) {
        //     return <div>Loading</div>;
        // }

        return (
            <Fragment>
                {authenticated === true ? (
                    <Auth
                        unauthorizedError={unauthorizedError}
                        authRedirection={this.props.authRedirection}
                        {...this.props}
                    />
                ) : (
                        <Global unauthorizedError={unauthorizedError}
                            authRedirection={this.props.authRedirection} 
                            {...this.props}
                            />
                    )}
            </Fragment>
        );
    }
}
