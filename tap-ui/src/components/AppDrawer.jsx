//HOC and utils
import React from "react";
import PropTypes from "prop-types";
import { Route, Router } from "react-router-dom";
import withRouter from "./withRouter";
import { withStyles } from "@material-ui/core";
//components and libraries
import {
    Drawer,
    IconButton,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar,
    Typography,
    Tooltip,
} from "@material-ui/core";
//icons
import {
    Info,
    Help,
    FilterDrama,
    FormatListBulleted,
    AccountCircle,
    AttachMoney,
    Language,
    SettingsPower,
} from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InfoDialog from "../tools/info_dialog/InfoDialog";
import logoURL from "../images/logo.png";

import withProps from "./HOC";

const drawerWidth = 240;

const styles = (theme) => ({
    root: {
        display: "flex",
    },
    contentShift: {
        marginLeft: +200,
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBar: {
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20,
    },
    hide: {
        display: "none",
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        padding: "0 8px",
        ...theme.mixins.toolbar,
        justifyContent: "flex-end",
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    row: {
        display: "flex",
        justifyContent: "center",
    },
    utility: {
        alignSelf: "center",
        margin: 45,
    },
    logo: {
        maxWidth: "30vw",
        maxHeight: "30vh",
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 20,
    },
    account: {
        textAlign: "center",
    },
    accountContainer: {
        display: "inline-block",
    },
    chameleon: {
        "background-image":
            "linear-gradient(to right, orange,yellow,green,cyan)",
    },
    chameleonCustomer: {
        textAlign: "center",
        "font-weight": "bold",
    },
});

/**
 * This is the main menu drawer of the react app
 *
 * ```html
 * <MainDrawer isOpen={this.state.open} handleDrawerToggle={() => this.handleDrawerToggle()} />
 * ```
 */
class MainDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            helpOpen: false,
            infoOpen: false,
        };
    }

    handleClose(type = "") {
        if (type == "help") {
            this.setState({ helpOpen: !this.state.helpOpen });
        } else if (type == "info") {
            this.setState({ infoOpen: !this.state.infoOpen });
        }
    }

    render() {
        const { classes, theme } = this.props;
        return (
            <div>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={this.props.isOpen}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    transitionDuration={{
                        enter: theme.transitions.duration.enteringScreen,
                        exit: theme.transitions.duration.leavingScreen,
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton
                            onClick={() => this.props.handleDrawerToggle(true)}
                        >
                            {theme.direction === "ltr" ? (
                                <ChevronLeftIcon />
                            ) : (
                                <ChevronRightIcon />
                            )}
                        </IconButton>
                    </div>
                    <div>
                        <img
                            src={logoURL}
                            alt="Logo DRBV"
                            className={classes.logo}
                        />
                    </div>
                    <List>
                        <Divider />

                        {this.props.routes &&
                            this.props.routes.map((route) => {
                                let item = (
                                    <ListItem
                                        button
                                        key={route.name + new Date()}
                                        onClick={() => {
                                            this.props.history.push(route.path);
                                            this.props.handleDrawerToggle();
                                        }}
                                    >
                                        {route.icon && (
                                            <ListItemIcon>
                                                {route.icon}
                                            </ListItemIcon>
                                        )}
                                        <ListItemText primary={route.name} />
                                    </ListItem>
                                );
                                if (route.hide) {
                                    return null;
                                } else if (
                                    route.admin &&
                                    this.props.user &&
                                    this.props.user.role == "admin"
                                ) {
                                    return item;
                                } else if (!route.admin) {
                                    return item;
                                }
                                return null;
                            })}
                    </List>
                    <Divider />

                    <div className={classes.utility}>
                        <Tooltip
                            title="title"
                            placement="top"
                            disableFocusListener
                        >
                            <IconButton
                                edge="start"
                                onClick={() => {
                                    this.setState({
                                        infoOpen: !this.state.infoOpen,
                                    });
                                }}
                            >
                                {" "}
                                <Info />{" "}
                            </IconButton>
                        </Tooltip>

                        <Tooltip
                            title="help"
                            placement="top"
                            disableFocusListener
                        >
                            <IconButton
                                edge="start"
                                onClick={() => {
                                    this.setState({
                                        helpOpen: !this.state.helpOpen,
                                    });
                                }}
                            >
                                {" "}
                                <Help />{" "}
                            </IconButton>
                        </Tooltip>
                    </div>
                </Drawer>
                {this.state.infoOpen && (
                    <InfoDialog
                        handleClose={() => {
                            this.handleClose("info");
                        }}
                        open={this.state.infoOpen}
                    />
                )}
            </div>
        );
    }
}

MainDrawer.propTypes = {
    /**
     * handels the drawer open and close process
     */
    handleDrawerToggle: PropTypes.func,
    /**
     * contains state of drawer (open/close)
     */
    isOpen: PropTypes.bool,
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
    withRouter(withProps(MainDrawer))
);
