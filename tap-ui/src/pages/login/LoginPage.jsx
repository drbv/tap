//HOC and utils
import React from "react";
import { PropTypes } from "prop-types";
import { withRouter } from "react-router-dom";
import { Translate, withLocalize } from "react-localize-redux";
import withStyles from "@material-ui/core/es/styles/withStyles";
//translation
import loginPage from "../../translations/login_page.json";
import logoURL from "../../images/logo.png";
//components and libraries
import {
    Typography,
    Paper,
    Grid,
    TextField,
    Checkbox,
    FormControlLabel,
    Button,
    LinearProgress,
    CircularProgress,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import withProps from "../../components/HOC";
import { getCollection } from "../../Database";

const styles = (theme) => ({
    root: {
        padding: theme.spacing(2),
        margin: theme.spacing(2),
        borderRadius: "7px",
    },
    first_element_margin: {
        "margin-top": "1%",
    },
    header_text: {
        "font-weight": "bold",
        "font-size": "35px",
        style: "font-family:sans-serif",
    },
    sentry_text: {
        color: "#888",
    },
    element_space_top: {
        "margin-top": "10px",
    },
    versionText: {
        marginLeft: 10,
        // position: "absolute",
        bottom: 0,
    },
    logo: {
        maxWidth: "35vw",
        maxHeight: "35vh",
        marginBottom: "2rem",
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
    },
});

/**
 *  This is the main file of the orders page
 */
class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            password: "",
            selectedUser: null,
        };
        //load translation
        this.props.addTranslation(loginPage);

        this.subs = [];
    }

    async componentDidMount() {
        getCollection("user").then(async (collection) => {
            const sub = await collection.find().$.subscribe((users) => {
                if (!users) {
                    return;
                }
                console.log("reload users-list ");
                console.dir(users);
                this.setState({
                    users,
                });
            });
            this.subs.push(sub);
        });
    }

    render() {
        const { classes, theme, isLoggedIn } = this.props;
        const { users, selectedUser } = this.state;

        return isLoggedIn == false ? (
            <div>
                <Grid
                    container
                    direction='column'
                    justifyContent='center'
                    alignContent='center'
                    className={classes.first_element_margin}
                >
                    <Paper className={classes.root} elevation={1}>
                        <div>
                            <Grid
                                container
                                direction='column'
                                justifyContent='center'
                                alignItems='center'
                                className={classes.element_space_top}
                            >
                                <Grid item sm={12}>
                                    <img
                                        src={logoURL}
                                        alt='Logo DRBV'
                                        className={classes.logo}
                                    />
                                </Grid>
                                <Grid item sm={12}>
                                    <Typography variant='h6' color='inherit'>
                                        Bitte einloggen:
                                    </Typography>
                                </Grid>
                                <Grid item sm={12}>
                                    <Typography component='p' color='error'>
                                        {this.props.loginError != "" ? (
                                            this.props.loginError
                                        ) : (
                                            <CircularProgress />
                                        )}
                                    </Typography>
                                </Grid>
                                <Grid item sm={12}>
                                    <Autocomplete
                                        options={users}
                                        style={{ width: "300px" }}
                                        value={this.state.selectedUser}
                                        onChange={(e, newValue) => {
                                            users &&
                                                newValue &&
                                                this.setState({
                                                    selectedUser: newValue,
                                                });
                                        }}
                                        getOptionLabel={(option) => option.name}
                                        id='Nutzer'
                                        debug
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label='Nutzer'
                                                margin='normal'
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item sm={12}>
                                    <TextField
                                        autoFocus
                                        margin='dense'
                                        id='password'
                                        name='Passwort'
                                        style={{ width: "300px" }}
                                        value={this.state.password}
                                        onChange={(e) => {
                                            this.setState({
                                                password: e.target.value,
                                            });
                                        }}
                                        label='Passwort'
                                        type='text'
                                        fullWidth
                                        className={classes.inputContent}
                                    />
                                </Grid>
                                <Grid item sm={12}>
                                    <Button
                                        variant='contained'
                                        color='secondary'
                                        onClick={() => {
                                            this.props.loadUser(
                                                selectedUser &&
                                                    selectedUser.id.toString(),
                                                this.state.password.toString()
                                            );
                                        }}
                                        style={{ marginTop: "10px" }}
                                    >
                                        Einloggen
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </Paper>
                </Grid>
            </div>
        ) : (
            <LinearProgress />
        );
    }
}

LoginPage.propTypes = {
    /**
     * style classes injected with withStyles
     */
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(
    withProps(withLocalize(withRouter(LoginPage)))
);
