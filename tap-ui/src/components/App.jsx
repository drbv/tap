import React, { Suspense, Component, lazy } from "react";
import { PropTypes } from "prop-types";
import { renderToStaticMarkup } from "react-dom/server";
import classNames from "classnames";

import { LinearProgress, CssBaseline, withStyles } from "@material-ui/core";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ls from "local-storage";

import { Translate, withLocalize } from "react-localize-redux";
import globalTranslations from "../translations/global.json";

import withProps from "./HOC";
import AppNavbar from "./AppNavbar";
import MainDrawer from "./AppDrawer";

import { getBaseCollection, getCollection } from "../Database";

const LoginPage = lazy(() => import("../pages/login/LoginPage"));
const SetupPage = lazy(() => import("../pages/setup/SetupPage"));

const drawerWidth = 240;

const styles = (theme) => ({
    content: {
        flexGrow: 1,
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: +drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
});

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: true,
            competitionId: null,
        };

        this.subs = [];

        this.props.initialize({
            languages: [
                { name: "Deutsch", code: "de" },
                { name: "English", code: "en" },
            ],
            translation: globalTranslations,
            options: {
                renderToStaticMarkup,
                defaultLanguage:
                    ls("default_lng") !== null ? ls("default_lng") : "de",
            },
        });
    }

    componentDidMount() {
        this.setState({ open: !this.props.smallScreen });
    }

    componentWillUnmount() {
        // Unsubscribe from all subscriptions
        this.subs.forEach((sub) => sub.unsubscribe());
    }

    /**
     * toggles the drawer
     */
    handleDrawerToggle(force = false) {
        if (force) this.setState({ open: !this.state.open });
        else if (this.props.smallScreen)
            this.setState({ open: !this.state.open });
    }

    getRoutes() {
        return (
            <Routes>
                {this.props.routes.map((route) => {
                    let routing = (
                        <Route
                            key={route.name}
                            exact={route.exact}
                            path={route.path}
                        >
                            {route.component}
                        </Route>
                    );
                    if (
                        route.admin &&
                        this.props.user &&
                        this.props.user.role == "admin"
                    ) {
                        return routing;
                    } else if (!route.admin) {
                        return routing;
                    }
                })}
            </Routes>
        );
    }

    render() {
        const { classes } = this.props;

        return (
            <Router>
                <div className="App">
                    <CssBaseline />
                    {this.props.isLoggedIn && this.props.competitionId && (
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
                    <Suspense fallback={<LinearProgress />}>
                        {!this.props.competitionId ? (
                            <SetupPage />
                        ) : this.props.isLoggedIn ? (
                            <main
                                className={classNames(classes.content, {
                                    [classes.contentShift]: !(
                                        !this.props.smallScreen &&
                                        this.state.open
                                    ),
                                })}
                            >
                                {this.props.routes && this.getRoutes()}
                            </main>
                        ) : (
                            <LoginPage />
                        )}
                    </Suspense>
                </div>
            </Router>
        );
    }
}

// Specifies the default values for props:
App.defaultProps = {
    routes: {
        routes: [
            {
                name: "default",
                path: "/",
                exact: true,
                component: <LinearProgress />,
                icon: null,
                hide: true,
            },
        ],
    },
};

App.propTypes = {
    /**
   * routes array. essential for all routes to be rendered
   * const Routes = {
      "routes": [
      { "name": "dashboard", "path": "/", exact: true, "component": <Dashboard />, "admin": false, "icon": null, "hide": true },
      }
   */
    routes: PropTypes.array,
};

export default withStyles(styles, { withTheme: true })(
    withLocalize(withProps(App))
);
