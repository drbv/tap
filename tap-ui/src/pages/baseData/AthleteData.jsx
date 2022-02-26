import React, { Component } from "react";

import {
    withStyles,
    LinearProgress,
    Paper,
    Button,
    Tooltip,
    IconButton,
    Typography,
} from "@material-ui/core";
import MUIDataTable from "mui-datatables";

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

class AthleteData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Athletes: null,
        };

        this.subs = [];
    }

    async componentDidMount() {
        getBaseCollection("athletes").then(async (collection) => {
            const sub = await collection.find().$.subscribe((Athletes) => {
                if (!Athletes) {
                    return;
                }
                console.log("reload Athlete-list");
                console.dir(Athletes);
                this.setState({
                    Athletes,
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
        const { Athletes } = this.state;
        return (
            <div>
                {Athletes != null ? (
                    <MUIDataTable
                        className={classes.table}
                        data={Athletes}
                        columns={[
                            {
                                name: "rfid",
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: "bookId",
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: "pre_name",
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: "family_name",
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: "birth_year",
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: "sex",
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: "club_id",
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: "club_name_short",
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: "organization",
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: "sport",
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

export default withStyles(styles, { withTheme: true })(AthleteData);
