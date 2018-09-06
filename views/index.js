import 'core-js'
// import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import * as ReactRedux from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { Route } from 'react-router-dom'
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import * as Containers from 'containers/index'
import newReducer from 'reducers/index'
import './index.less'

const history = createHistory()
const middleware = routerMiddleware(history)

const store = createStore(combineReducers({
  ...newReducer,
  router: routerReducer
}), compose(applyMiddleware(middleware, thunkMiddleware)))

history.listen((location, action) => {
// Do permission detect
})

ReactDOM.render(
  <ReactRedux.Provider store={store}>
    <ConnectedRouter history={history} forceRefresh>
      <div>
        <Route exact path='/' component={Containers.dashboard} />
        <Route exact path='/about' component={Containers.about} />
        <Route exact path='/topic' component={Containers.topic} />
        <Route exact path='/topic/:id' component={Containers.topic} />
      </div>
    </ConnectedRouter>
  </ReactRedux.Provider>,
  document.getElementById('root')
)
