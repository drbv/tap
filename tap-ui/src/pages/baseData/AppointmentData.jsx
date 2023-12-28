import React, { Component } from "react";

import {
    withStyles,
    LinearProgress,
    Paper,
    Button,
    Tooltip,
    IconButton,
    Typography,
    CircularProgress,
} from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import axios from "axios";

import withProps from "../../components/HOC";
import { getBaseCollection } from "../../Database";

const styles = (theme) => ({
    root: {
        padding: theme.spacing(2),
        margin: "11px",
    },
    table: {
        margin: "11px",
        marginBottom: "80px",
    },
});

class AppointmentData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Appointments: null,
            loading: false,
        };

        this.subs = [];
    }

    async componentDidMount() {
        getBaseCollection("appointments").then(async (collection) => {
            const sub = await collection.find().$.subscribe((Appointments) => {
                if (!Appointments) {
                    return;
                }
                console.log("reload Appointment-list");
                console.dir(Appointments);
                this.setState({
                    Appointments,
                });
            });
            this.subs.push(sub);
        });
    }

    componentWillUnmount() {
        // Unsubscribe from all subscriptions
        this.subs.forEach((sub) => sub.unsubscribe);
    }

    render() {
        const { classes } = this.props;
        const { Appointments } = this.state;
        return (
            <div>
                {Appointments != null ? (
                    <MUIDataTable
                        className={classes.table}
                        data={Appointments}
                        columns={[
                            {
                                name: "appointment_id",
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: "date",
                                options: {
                                    filter: false,
                                },
                            },
                            /*{
                                name: 'club_id',
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: 'club_name_short',
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: 'series_name',
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: 'competition_name',
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: 'location',
                                options: {
                                    filter: false,
                                },
                            },*/
                            {
                                name: "city",
                                options: {
                                    filter: false,
                                },
                            },
                            /*{
                                name: 'street',
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: 'postal_code',
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: 'begin_time',
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: 'end_time',
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: 'competition_type',
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: 'league',
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: 'tl',
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: 'limitations',
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: 'contact_person',
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: 'begin_evening_event',
                                options: {
                                    filter: false,
                                },
                            },*/
                            {
                                // only set by server
                                name: "isActive",
                                options: {
                                    filter: false,
                                    customBodyRender: (value, tableMeta) => {
                                        if (
                                            tableMeta.rowData[0] ==
                                            this.props.competitionId
                                        ) {
                                            return (
                                                <Button
                                                    className={
                                                        classes.newRoundButton
                                                    }
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={() => {
                                                        alert(
                                                            "Sind sie sicher?"
                                                        );
                                                        //TODO: Daten entfernen
                                                    }}
                                                >
                                                    Turnier beenden
                                                </Button>
                                            );
                                        } else {
                                            return (
                                                <Button
                                                    className={
                                                        classes.newEvaluationButton
                                                    }
                                                    variant="contained"
                                                    color="error"
                                                    onClick={async () => {
                                                        this.setState({
                                                            loading: true,
                                                        });
                                                        axios
                                                            .get(
                                                                "http://localhost:5005/activate?id=" +
                                                                    tableMeta
                                                                        .rowData[0]
                                                            )
                                                            .then(
                                                                (response) => {
                                                                    console.dir(
                                                                        response
                                                                    );
                                                                    this.setState(
                                                                        {
                                                                            loading: false,
                                                                        }
                                                                    );
                                                                }
                                                            )
                                                            .catch((error) => {
                                                                console.log(
                                                                    error
                                                                );
                                                                this.setState({
                                                                    loading: false,
                                                                });
                                                            });
                                                    }}
                                                >
                                                    {this.state.loading ? (
                                                        <CircularProgress color="secondary" />
                                                    ) : (
                                                        "Dieses Turnier verwenden"
                                                    )}
                                                </Button>
                                            );
                                        }
                                    },
                                },
                            },
                            {
                                name: "createState",
                                options: {
                                    filter: false,
                                },
                            },
                        ]}
                        options={{
                            selectableRows: "none",
                            rowsPerPageOptions: [10, 50, 100, 250],
                        }}
                    ></MUIDataTable>
                ) : (
                    <LinearProgress />
                )}
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(
    withProps(AppointmentData)
);
