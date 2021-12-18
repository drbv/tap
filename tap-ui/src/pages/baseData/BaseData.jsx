import React, { Component, lazy } from 'react'
import { Route, withRouter } from 'react-router-dom'

import { withStyles, Tabs, Tab, Typography } from '@material-ui/core'

const AcroData = lazy(() => import('./AcroData'))
const AthleteData = lazy(() => import('./AthleteData'))
const AppointmentData = lazy(() => import('./AppointmentData'))
const OfficialData = lazy(() => import('./OfficialData'))
const TeamData = lazy(() => import('./TeamData'))

const styles = (theme) => ({
    root: {
        padding: theme.spacing(2),
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

class BaseData extends Component {
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
                    path="/base"
                    render={() => {
                        return (
                            <div>
                                <Tabs
                                    value={this.state.tab}
                                    onChange={(e, value) => {
                                        this.setState({ tab: value })
                                    }}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    variant="fullWidth"
                                >
                                    <Tab
                                        label={
                                            <Typography
                                                className={classes.tablabel}
                                                color="textPrimary"
                                                display="initial"
                                            >
                                                Akrobatiken
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
                                                Turniere
                                            </Typography>
                                        }
                                        {...a11yProps(1)}
                                    />
                                    <Tab
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
                                    />
                                </Tabs>
                                <TabPanel value={this.state.tab} index={0}>
                                    <AcroData />
                                </TabPanel>
                                <TabPanel value={this.state.tab} index={1}>
                                    <AppointmentData />
                                </TabPanel>
                                <TabPanel value={this.state.tab} index={2}>
                                    <AthleteData />
                                </TabPanel>
                                <TabPanel value={this.state.tab} index={3}>
                                    <OfficialData />
                                </TabPanel>
                                <TabPanel value={this.state.tab} index={4}>
                                    <TeamData />
                                </TabPanel>
                            </div>
                        )
                    }}
                />
            </div>
        )
    }
}

export default withStyles(styles)(withRouter(BaseData))
