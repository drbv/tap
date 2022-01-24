import React, { Component } from "react"

import {
    withStyles,
    LinearProgress,
    Paper,
    Button,
    Tooltip,
    IconButton,
    Typography,
    TextField,
    Grid,
} from "@material-ui/core"
import MUIDataTable from "mui-datatables"
import axios from "axios"

import { getBaseCollection, getCollection } from "../../Database"
import { Autocomplete } from "@mui/material"

const styles = (theme) => ({
    root: {
        padding: theme.spacing(2),
        margin: "11px",
    },
    text: {
        "text-transform": "none",
    },
})

class Competition extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedAppointment: null,
            Appointments: null,
        }

        this.subs = []
    }

    async componentDidMount() {
        getBaseCollection("appointments").then(async (collection) => {
            const sub = await collection.find().$.subscribe((Appointments) => {
                if (!Appointments) {
                    return
                }
                console.log("reload Appointment-list")
                console.dir(Appointments)
                this.setState({
                    Appointments,
                })
            })
            this.subs.push(sub)
        })
    }

    componentWillUnmount() {
        // Unsubscribe from all subscriptions
        this.subs.forEach((sub) => sub.unsubscribe)
    }

    render() {
        const { classes } = this.props
        const { Appointments, selectedAppointment } = this.state
        return (
            <div>
                <Paper className={classes.root}>
                    <Typography
                        className={classes.text}
                        color="textPrimary"
                        display="initial"
                    >
                        Bitte im folgenden das Turnier auswählen
                    </Typography>
                    <Grid container spacing={3} alignItems="flex-end">
                        <Grid
                            item
                            xs={
                                selectedAppointment && selectedAppointment != ""
                                    ? 8
                                    : 12
                            }
                        >
                            <Autocomplete
                                options={Appointments}
                                style={{ width: "100%" }}
                                value={selectedAppointment}
                                onChange={(e, newValue) => {
                                    Appointments &&
                                        newValue &&
                                        this.setState({
                                            selectedAppointment: newValue,
                                        })
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
                            <Grid item xs={4}>
                                <Button
                                    className={classes.newEvaluationButton}
                                    variant="contained"
                                    color="secondary"
                                    onClick={async () => {
                                        axios
                                            .get(
                                                "http://localhost:5000/activate?id=" +
                                                    selectedAppointment.appointment_id
                                            )
                                            .then((response) => {
                                                console.dir(response)
                                            })
                                            .catch((error) => {
                                                console.log(error)
                                            })
                                    }}
                                >
                                    Dieses Turnier verwenden
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(Competition)
