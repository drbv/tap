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

class OfficialData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Officials: null,
        };

        this.subs = [];
    }

    async componentDidMount() {
        getBaseCollection("officials").then(async (collection) => {
            const sub = await collection.find().$.subscribe((Officials) => {
                if (!Officials) {
                    return;
                }
                console.log("reload Official-list");
                console.dir(Officials);
                this.setState({
                    Officials,
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
        const { Officials } = this.state;
        return (
            <div>
                {Officials != null ? (
                    <MUIDataTable
                        className={classes.table}
                        data={Officials}
                        columns={[
                            {
                                name: "id",
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: "rfid",
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
                                name: "club_id",
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: "licence",
                                options: {
                                    filter: false,
                                    customBodyRender: (value) => {
                                        var resultString = "";

                                        value.tl && (resultString += "tl ");
                                        value.rr &&
                                            value.rr.wre &&
                                            (resultString += "rr(wre) ");
                                        value.rr &&
                                            value.rr.wra &&
                                            (resultString += "rr(wra) ");
                                        value.bw &&
                                            value.bw.wre &&
                                            (resultString += "bw(wre)");

                                        return resultString;
                                    },
                                },
                            },
                            {
                                name: "email",
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

export default withStyles(styles, { withTheme: true })(OfficialData);
