//HOC and utils
import React from "react";
import { PropTypes } from "prop-types";
import { withRouter } from "react-router-dom";
import { Translate, withLocalize } from "react-localize-redux";
import withStyles from "@material-ui/core/es/styles/withStyles";
//translation
import setupPage from "../../translations/setup_page.json";
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
} from "@mui/material";
import { Autocomplete } from "@material-ui/lab";
import axios from "axios";

import withProps from "../../components/HOC";
import { getBaseCollection, getCollection } from "../../Database";

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
class SetupPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAppointment: null,
            appointments: [],
            loading: false,
        };
        //load translation
        this.props.addTranslation(setupPage);

        this.subs = [];
    }

    async componentDidMount() {
        getBaseCollection("appointments").then(async (collection) => {
            const sub = await collection.find().$.subscribe((appointments) => {
                if (!appointments) {
                    return;
                }
                console.log("reload Appointment-list");
                console.dir(appointments);
                this.setState({
                    appointments,
                });
            });
            this.subs.push(sub);
        });
    }

    componentWillUnmount() {
        // Unsubscribe from all subscriptions
        this.subs.forEach((sub) => sub.unsubscribe());
    }

    render() {
        const { classes } = this.props;
        const { appointments, selectedAppointment } = this.state;

        return (
            <div>
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignContent="center"
                    className={classes.first_element_margin}
                >
                    <Paper
                        sx={{ width: 1 }}
                        className={classes.root}
                        elevation={1}
                    >
                        <Typography
                            className={classes.text}
                            color="textPrimary"
                            display="initial"
                        >
                            Bitte im folgenden das Turnier auswählen
                        </Typography>
                        <Grid
                            container
                            spacing={3}
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                        >
                            <Grid
                                item
                                xs={
                                    selectedAppointment &&
                                    selectedAppointment != ""
                                        ? 10
                                        : 12
                                }
                            >
                                <Autocomplete
                                    options={appointments}
                                    style={{ width: "100%" }}
                                    value={selectedAppointment}
                                    onChange={(e, newValue) => {
                                        appointments &&
                                            newValue &&
                                            this.setState({
                                                selectedAppointment: newValue,
                                            });
                                    }}
                                    getOptionLabel={(option) =>
                                        option.date +
                                        ": " +
                                        option.club_name_short +
                                        " - " +
                                        option.competition_name
                                    }
                                    id="Turnierauswahl"
                                    debug
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Turniere"
                                            margin="normal"
                                        />
                                    )}
                                />
                            </Grid>
                            {selectedAppointment && selectedAppointment != "" && (
                                <Grid item xs={2}>
                                    <Button
                                        className={classes.newEvaluationButton}
                                        variant="contained"
                                        color="error"
                                        onClick={async () => {
                                            this.setState({ loading: true });
                                            axios
                                                .get(
                                                    "http://localhost:5001/activate?id=" +
                                                        selectedAppointment.appointment_id
                                                )
                                                .then((response) => {
                                                    console.dir(response);
                                                })
                                                .catch((error) => {
                                                    console.log(error);
                                                });
                                        }}
                                    >
                                        {this.state.loading ? (
                                            <CircularProgress color="secondary" />
                                        ) : (
                                            "Dieses Turnier verwenden"
                                        )}
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
                    </Paper>
                </Grid>
            </div>
        );
    }
}

SetupPage.propTypes = {
    /**
     * style classes injected with withStyles
     */
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(
    withProps(withLocalize(withRouter(SetupPage)))
);
