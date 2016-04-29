import React from 'react'
import ReactDOM from 'react-dom'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { Router, useRouterHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import createStore from './store/createStore'
import { Provider } from 'react-redux'
import { addLocaleData, IntlProvider } from 'react-intl'
import {lang} from './utils'

const MOUNT_ELEMENT = document.getElementById('root')

// Configure history for react-router
const browserHistory = useRouterHistory(createBrowserHistory)({
  basename: __BASENAME__
})

// Create redux store and sync with react-router-redux. We have installed the
// react-router-redux reducer under the key "router" in src/routes/index.js,
// so we need to provide a custom `selectLocationState` to inform
// react-router-redux of its location.
const store = createStore(window.__INITIAL_STATE__, browserHistory)
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: (state) => state.router
})

// 语言设置
const locale = lang()

const startup = (key, locale, messages) => {
  const routes = require('./routes/index').default(store)
  const intlData = {
    locale: locale,
    messages: messages
  }
  const App = (
    <Provider store={store}>
      <IntlProvider {...intlData}>
        <Router history={history} children={routes} key={key} />
      </IntlProvider>
    </Provider>
  )
  ReactDOM.render(App, MOUNT_ELEMENT)
}

// 附加中文国际化资源
const startupWithZhLocalData = (key) => {
  if (!global.Intl) {
    require.ensure(['intl', 'react-intl/locale-data/zh', './i18n/zh'], (require) => {
      require('intl')
      const localData = require('react-intl/locale-data/zh')
      const messages = require('./i18n/zh').default
      addLocaleData(localData)
      startup(key, locale, messages)
    }, 'IntlBundle')
  } else {
    require.ensure(['react-intl/locale-data/zh', './i18n/zh'], (require) => {
      const localData = require('react-intl/locale-data/zh')
      const messages = require('./i18n/zh').default
      addLocaleData(localData)
      startup(key, locale, messages)
    })
  }
}

// 附加英文文国际化资源
const startupWithEnLocalData = (key) => {
  if (!global.Intl) {
    require.ensure(['intl', 'react-intl/locale-data/en', './i18n/en'], (require) => {
      require('intl')
      const localData = require('react-intl/locale-data/en')
      const messages = require('./i18n/en').default
      addLocaleData(localData)
      startup(key, locale, messages)
    }, 'IntlBundle')
  } else {
    require.ensure(['react-intl/locale-data/en', './i18n/en'], (require) => {
      const localData = require('react-intl/locale-data/en')
      const messages = require('./i18n/en').default
      addLocaleData(localData)
      startup(key, locale, messages)
    })
  }
}

let render = (key = null) => {
  if (locale === 'zh') {
    startupWithZhLocalData(key)
  } else {
    startupWithEnLocalData(key)
  }
}

// Enable HMR and catch runtime errors in RedBox
// This code is excluded from production bundle
if (__DEV__ && module.hot) {
  const renderApp = render
  const renderError = (error) => {
    const RedBox = require('redbox-react')
    ReactDOM.render(<RedBox error={error}/>, MOUNT_ELEMENT)
  }
  render = () => {
    try {
      renderApp(Math.random())
    } catch (error) {
      renderError(error)
    }
  }
  module.hot.accept(['./routes/index'], () => render())
}

// Use Redux DevTools chrome extension
if (__DEBUG__) {
  if (window.devToolsExtension) window.devToolsExtension.open()
}

render()
