import React, { lazy, Component, Fragment } from "react";
import { USER_CATEGORY } from "../../constant";

const Doctors = lazy(() =>
  import(/* webpackChunkName: "DoctorsRouter" */ "../Doctors")
);

const Admin = lazy(() =>
  import(/* webpackChunkName: "AdminRouter" */ "../Admin")
);

const Provider = lazy(() => 
  import(/* webpackChunkName: "ProviderRouter" */ "../Provider") )

const Common = lazy(() =>
    import(
        /* webpackChunkName: "Consent" */ "../Common"
        )
);

export default class Authenticated extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      authenticated_category,
      hasConsent = false,
    } = this.props;
    return (
      <Fragment>
            {!hasConsent ? (<Common/>) : (
              <Fragment>
                {/* video chat T&C */}

                {/* Sidebar */}
                {authenticated_category === USER_CATEGORY.DOCTOR && (
                    <Doctors {...this.props} />
                )}
                { (authenticated_category === USER_CATEGORY.ADMIN) && (
                    <Admin {...this.props} />
                )}
                { (authenticated_category === USER_CATEGORY.PROVIDER) && (
                    <Provider {...this.props} />
                )}
              </Fragment>
            )}
      </Fragment>
    );
  }
}
