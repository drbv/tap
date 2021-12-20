import React, { Component, lazy } from 'react'
import { Route, withRouter } from 'react-router-dom'

import { withStyles, Tabs, Tab, Typography, Paper } from '@material-ui/core'

const Competition = lazy(() => import('./Competition'))
const Evaluations = lazy(() => import('./Evaluations'))

const styles = (theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        margin: '11px',
    },
    tablabel: {
        'text-transform': 'none',
    },
})

function a11yProps(index) {
    return {
        id: `scrollable-prevent-tab-${index}`,
        'aria-controls': `scrollable-prevent-tabpanel-${index}`,
    }
}

function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-prevent-tabpanel-${index}`}
            aria-labelledby={`scrollable-prevent-tab-${index}`}
            {...other}
        >
            {value === index && <div>{children}</div>}
        </div>
    )
}

class Conditions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tab: 0,
        }
    }
    render() {
        const { classes } = this.props
        return (
            <div>
                <Route
                    exact
                    path="/conditions"
                    render={() => {
                        return (
                            <div>
                                <Paper className={classes.root}>
                                    <Tabs
                                        value={this.state.tab}
                                        onChange={(e, value) => {
                                            this.setState({ tab: value })
                                        }}
                                        indicatorColor="secondary"
                                        textColor="secondary"
                                        variant="fullWidth"
                                    >
                                        <Tab
                                            label={
                                                <Typography
                                                    className={classes.tablabel}
                                                    color="textPrimary"
                                                    display="initial"
                                                >
                                                    1: Turnierauswahl
                                                </Typography>
                                            }
                                            {...a11yProps(0)}
                                        />
                                        <Tab
                                            label={
                                                <Typography
                                                    className={classes.tablabel}
                                                    color="textPrimary"
                                                >
                                                    2: Wertungsvorschriften
                                                </Typography>
                                            }
                                            {...a11yProps(1)}
                                        />
                                        {/*<Tab
                                            label={
                                                <Typography
                                                    className={classes.tablabel}
                                                    color="textPrimary"
                                                >
                                                    Athleten
                                                </Typography>
                                            }
                                            {...a11yProps(2)}
                                        />
                                        <Tab
                                            label={
                                                <Typography
                                                    className={classes.tablabel}
                                                    color="textPrimary"
                                                >
                                                    Offizielle
                                                </Typography>
                                            }
                                            {...a11yProps(3)}
                                        />
                                        <Tab
                                            label={
                                                <Typography
                                                    className={classes.tablabel}
                                                    color="textPrimary"
                                                >
                                                    Teams
                                                </Typography>
                                            }
                                            {...a11yProps(4)}
                                        />*/}
                                    </Tabs>
                                </Paper>
                                <TabPanel value={this.state.tab} index={0}>
                                    <Competition />
                                </TabPanel>
                                <TabPanel value={this.state.tab} index={1}>
                                    <Evaluations />
                                </TabPanel>
                                {/*<TabPanel value={this.state.tab} index={2}>
                    <AthleteData />
                </TabPanel>
                <TabPanel value={this.state.tab} index={3}>
                    <OfficialData />
                </TabPanel>
                <TabPanel value={this.state.tab} index={4}>
                    <TeamData />
                </TabPanel>*/}
                            </div>
                        )
                    }}
                />
            </div>
        )
    }
}

export default withStyles(styles)(withRouter(Conditions))
