import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import { IntlProvider, addLocaleData } from "react-intl";
import arLocaleData from "react-intl/locale-data/ar";
import esLocaleData from "react-intl/locale-data/es";
import hiLocalData from "react-intl/locale-data/hi";
import { composeWithDevTools } from "redux-devtools-extension";
import allReducers from "./modules";
import translations from "./i18n/locales";
import retainState from "./RetainState";
import { getQuery } from "./Helper/queryString";
import * as serviceWorker from "./serviceWorker";

import "./Styles/index.less";

/* 
The web-vitals library is a tiny (~1K), modular library for measuring 
all the Web Vitals metrics on real users, in a way that accurately matches 
how they're measured by Chrome and reported to other Google tools 
(e.g. Chrome User Experience Report, Page Speed Insights, Search Console's Speed Report).
- Core Web Vitals
  - Cumulative Layout Shift (CLS)
  - First Input Delay (FID)
  - Largest Contentful Paint (LCP)
*/
import { getLCP, getFID, getCLS } from "web-vitals";

getCLS(console.log);
getFID(console.log);
getLCP(console.log);

const Desktop = lazy(() =>
  import(/* webpackChunkName: "DesktopWrapper" */ "./Containers/Routes")
);

const middleware = [thunk, retainState];

let store;
if (process.env.NODE_ENV === "development") {
  store = createStore(
    allReducers,
    composeWithDevTools(applyMiddleware(...middleware))
  );
} else {
  store = createStore(allReducers, applyMiddleware(...middleware));
}

addLocaleData(arLocaleData);
addLocaleData(esLocaleData);
addLocaleData(hiLocalData);
/* fetch locale */
const search = window.location.search;
const { locale = "en" } = getQuery(search);
const messages = translations[locale];

const sw = window.screen.width;

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider locale={locale} key={locale} messages={messages}>
      <Suspense fallback={null}>
        <Desktop />
      </Suspense>
    </IntlProvider>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
