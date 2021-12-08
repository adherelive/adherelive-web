import React, { Component, lazy, Fragment } from "react";
// import Footer from "../Containers/Footer";
import { BrowserRouter as Router } from "react-router-dom";
import Loading from "../Components/Common/Loading";

const Global = lazy(() => import(/* webpackChunkName: "Global"*/ "./Global"));

const Auth = lazy(() =>
  import(/* webpackChunkName: "Auth"*/ "../Containers/Auth")
);

export default class Routes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    this.getInitialData();
  }

  getInitialData = async () => {
    try {
      const { getInitialData } = this.props;
      this.setState({ loading: true });
      const response = await getInitialData();

      const { status } = response || {};
      if (status === true) {
        this.setState({ loading: false });
      } else {
        this.setState({ loading: false });
      }
    } catch (error) {
      console.log("getInitialData catch error", error);
    }
  };

  render() {
    const { authenticated, unauthorizedError } = this.props;
    const { loading } = this.state;
    // if (authenticated !== true && authenticated !== false) {
    //     return <div>Loading</div>;
    // }

    if (loading) {
      return (
        <div className="wp100 hauto flex align-center justify-center">
          <Loading />
        </div>
      );
    }

    return (
      <Fragment>
        <Router>
          {authenticated === true ? (
            <Auth
              unauthorizedError={unauthorizedError}
              authRedirection={this.props.authRedirection}
              {...this.props}
            />
          ) : (
            <Global
              unauthorizedError={unauthorizedError}
              authRedirection={this.props.authRedirection}
              {...this.props}
            />
          )}
        </Router>
      </Fragment>
    );
  }
}
