import React, { Fragment, Component } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    Container,
} from "reactstrap";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
    AppBar,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    ListItemText,
} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import MenuIcon from "@mui/icons-material/Menu";

import withProps from "./HOC";

//colors
import grey from "@material-ui/core/colors/grey";
import amber from "@material-ui/core/colors/amber";

const drawerWidth = 240;

const styles = (theme) => ({
    grow: {
        flexGrow: 1,
    },
    flexboxContainer: {
        display: "flex",
        "align-items": "center",
    },
    contentShift: {
        marginLeft: +200,
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBar: {
        "-webkit-app-region": "drag",
    },
    appBarToolbox: {
        "-webkit-app-region": "no-drag",
        marginRight: 9,
    },
    Offline: {
        backgroundColor: grey[700],
        color: grey[100],
    },
});

class AppNavbar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <AppBar position="static" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="Menu"
                        onClick={() => this.props.handleDrawerToggle(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <div
                        className={classnames(classes.grow, {
                            [classes.contentShift]: this.props.drawerOpen,
                        })}
                    />
                    <div
                        className={classnames(
                            classes.grow,
                            classes.flexboxContainer
                        )}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                        >
                            <BubbleChartIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit">
                            Wertungs-App
                        </Typography>
                    </div>
                    {this.props.user && (
                        <div>
                            <Typography variant="body2" color="inherit">
                                {"Eingeloggt: "}
                            </Typography>
                            <Typography variant="body2" color="inherit">
                                {this.props.user.name}
                            </Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={this.props.logout}
                                style={{ marginLeft: "10px" }}
                            >
                                Ausloggen
                            </Button>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        );
    }
}

AppNavbar.propTypes = {
    /**
     * handels the drawer pop out and close
     */
    handleDrawerToggle: PropTypes.func,
    handleOrderListReload: PropTypes.func,
    drawerOpen: PropTypes.bool,
};

export default withStyles(styles, { withTheme: true })(withProps(AppNavbar));
