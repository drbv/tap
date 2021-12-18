import React, { Suspense, Component, lazy } from 'react'
import { PropTypes } from 'prop-types'
import { renderToStaticMarkup } from 'react-dom/server'
import classNames from 'classnames'

import { LinearProgress, CssBaseline, withStyles } from '@material-ui/core'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import ls from 'local-storage'

import globalTranslations from '../translations/global.json'

import withProps from './HOC'
import AppNavbar from './AppNavbar'
import MainDrawer from './AppDrawer'

const LoginPage = lazy(() => import('../pages/login/LoginPage'))

const drawerWidth = 240

const styles = (theme) => ({
    content: {
        flexGrow: 1,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: +drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
})

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            languages: [{ name: 'Deutsch', code: 'de' }],
            translation: globalTranslations,
            options: {
                renderToStaticMarkup,
                defaultLanguage:
                    ls('default_lng') !== null ? ls('default_lng') : 'de',
            },

            open: true,
        }
    }

    componentDidMount() {
        this.setState({ open: !this.props.smallScreen })
    }

    /**
     * toggles the drawer
     */
    handleDrawerToggle(force = false) {
        if (force) this.setState({ open: !this.state.open })
        else if (this.props.smallScreen)
            this.setState({ open: !this.state.open })
    }

    getRoutes() {
        return (
            <Switch>
                {this.props.routes.map((route) => {
                    let routing = (
                        <Route
                            key={route.name}
                            exact={route.exact}
                            path={route.path}
                        >
                            {route.component}
                        </Route>
                    )
                    if (
                        route.admin &&
                        this.props.user &&
                        this.props.user.role == 'admin'
                    ) {
                        return routing
                    } else if (!route.admin) {
                        return routing
                    }
                })}
            </Switch>
        )
    }

    render() {
        const { classes } = this.props

        let content = null

        if (this.props.isLoggedIn) {
            content = (
                <div>
                    <main
                        className={classNames(classes.content, {
                            [classes.contentShift]: !(
                                !this.props.smallScreen && this.state.open
                            ),
                        })}
                    >
                        {this.props.routes && this.getRoutes()}
                    </main>
                </div>
            )
        } else {
            content = <LoginPage />
        }

        return (
            <Router>
                <div className="App">
                    <CssBaseline />
                    {this.props.isLoggedIn && (
                        <div>
                            <MainDrawer
                                isOpen={this.state.open}
                                handleDrawerToggle={(force) =>
                                    this.handleDrawerToggle(force)
                                }
                                routes={this.props.routes}
                            />
                            <AppNavbar
                                drawerOpen={this.state.open}
                                handleDrawerToggle={(force) =>
                                    this.handleDrawerToggle(force)
                                }
                            />
                        </div>
                    )}
                    <Suspense fallback={<LinearProgress />}>{content}</Suspense>
                </div>
            </Router>
        )
    }
}

// Specifies the default values for props:
App.defaultProps = {
    routes: {
        routes: [
            {
                name: 'default',
                path: '/',
                exact: true,
                component: <LinearProgress />,
                icon: null,
                hide: true,
            },
        ],
    },
}

App.propTypes = {
    /**
   * routes array. essential for all routes to be rendered
   * const Routes = {
      "routes": [
      { "name": "dashboard", "path": "/", exact: true, "component": <Dashboard />, "admin": false, "icon": null, "hide": true },
      }
   */
    routes: PropTypes.array,
}

export default withStyles(styles, { withTheme: true })(withProps(App))