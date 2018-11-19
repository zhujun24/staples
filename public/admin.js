import 'isomorphic-fetch'
import 'core-js'
// import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import * as ReactRedux from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { Route, Redirect } from 'react-router-dom'
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import * as Containers from 'containers'
import newReducer from 'reducers/index'
import './styles/public.less'
import './styles/admin.less'

const history = createHistory()
const middleware = routerMiddleware(history)

const store = createStore(combineReducers({
  ...newReducer,
  router: routerReducer
}), compose(applyMiddleware(middleware, thunkMiddleware)))

// history.listen((location, action) => {
// Do permission detect
// })

const PrivateRoute = ({ component: Component, ...rest }) => {
  return class extends Component {
    constructor (props) {
      super(props)
      this.state = {
        auth: false,
        hasAuthed: false
      }
    }

    componentDidMount () {
      fetch(`/api/${window.ADMIN_PATH}/islogin`, {
        credentials: 'include'
      }).then(res => res.json()).then(res => {
        this.setState({
          auth: res.login,
          hasAuthed: true
        })
      })
    }

    render () {
      if (!this.state.hasAuthed) {
        return null
      }
      return <Route {...rest} render={props => (
        this.state.auth ? (
          <Component {...props} />
        ) : (
          <Redirect to={{
            pathname: '/admin/login',
            state: { from: props.location }
          }} />
        )
      )} />
    }
  }
}

ReactDOM.render(
  <ReactRedux.Provider store={store}>
    <ConnectedRouter history={history} forceRefresh>
      <div>
        <Route exact path={`/${window.ADMIN_PATH}`} component={PrivateRoute({ component: Containers.dashboard })} />
        <Route path={`/${window.ADMIN_PATH}/login`} component={Containers.login} />
      </div>
    </ConnectedRouter>
  </ReactRedux.Provider>,
  document.getElementById('root')
)
