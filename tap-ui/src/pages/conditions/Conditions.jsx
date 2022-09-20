import React, { Component, lazy } from "react";
import { Route } from "react-router-dom";
import withRouter from "../../components/withRouter";

import { withStyles } from "@mui/styles";
import { Tab, Typography, Paper } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

const Competition = lazy(() => import("./Competition"));
const Scoringrule = lazy(() => import("./Scoringrule"));
const Phase = lazy(() => import("./Phase"));

const styles = (theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        margin: "11px",
    },
    tablabel: {
        "text-transform": "none",
    },
});

class Conditions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: "1",
        };
    }
    render() {
        const { classes } = this.props;
        return (
            <div>
                <Route
                    exact
                    path="/conditions"
                    render={() => {
                        return (
                            <div>
                                <TabContext value={this.state.tab}>
                                    <Paper className={classes.root}>
                                        <TabList
                                            onChange={(e, newValue) =>
                                                this.setState({ tab: newValue })
                                            }
                                            aria-label="lab API tabs example"
                                        >
                                            <Tab
                                                label="1: Turnierauswahl"
                                                value="1"
                                            />
                                            <Tab
                                                label="2: Stationen"
                                                value="2"
                                            />
                                            <Tab
                                                label="3: Wertungsvorschriften"
                                                value="3"
                                            />
                                        </TabList>
                                    </Paper>
                                    <TabPanel value="1">
                                        <Competition />
                                    </TabPanel>
                                    <TabPanel value="2">
                                        <Phase />
                                    </TabPanel>
                                    <TabPanel value="3">
                                        <Scoringrule />
                                    </TabPanel>
                                </TabContext>
                            </div>
                        );
                    }}
                />
            </div>
        );
    }
}

export default withStyles(styles)(withRouter(Conditions));
