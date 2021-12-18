import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import MUIDataTable from 'mui-datatables'
import {
    LinearProgress,
    Paper,
    Button,
    Tooltip,
    IconButton,
    Typography,
} from '@material-ui/core'
import { TipsAndUpdates } from '@mui/icons-material'
import withStyles from '@material-ui/core/es/styles/withStyles'
import withProps from '../../components/HOC'
import { getBaseCollection, closeCollection } from '../../Database'

const styles = (theme) => ({
    root: {
        flexGrow: 1,
        padding: 30,
    },
    table: {
        margin: '11px',
        marginBottom: '80px',
    },
    fetchAppointments: {
        margin: 10,
    },
    paper: {
        margin: '11px',
    },
    logo: {
        maxWidth: '10rem',
        maxHeight: '10rem',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 20,
    },
    disabled: {
        filter: 'opacity(50%) blur(1px)',
        '&:hover': {
            cursor: 'default',
        },
    },
})

class Dashboard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            Turnaments: null,
        }

        this.subs = []
    }

    async componentDidMount() {
        let collection = await getBaseCollection('appointments')
        let sub = await collection.find().$.subscribe((Turnaments) => {
            if (!Turnaments) {
                return
            }
            console.log('reload Tournament-list ')
            console.dir(Turnaments)
            this.setState({
                Turnaments,
            })
        })

        this.subs.push(sub)
    }

    render() {
        const { classes } = this.props
        const { Turnaments } = this.state
        return (
            <div>
                <Paper className={classes.table}>
                    <Button
                        className={classes.fetchAppointments}
                        color="inherit"
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                            this.setState({ newCoupleOpen: true })
                        }}
                    >
                        Turnierliste aktualisieren
                    </Button>
                    <Typography variant="text" color="initial">
                        Ausgewähltes Turnier:
                    </Typography>
                </Paper>
                {Turnaments != null ? (
                    <MUIDataTable
                        className={classes.table}
                        data={Turnaments}
                        columns={[
                            {
                                name: 'appointment_id',
                                options: {
                                    filter: false,
                                },
                                name: 'location',
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                                name: 'isActive',
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                                name: 'createState',
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                            },
                            {
                                name: 'Aktionen',
                                options: {
                                    sort: false,
                                    customBodyRender: (
                                        value,
                                        tableMeta,
                                        updateValue
                                    ) => {
                                        if (tableMeta.rowData != null) {
                                            return (
                                                <div>
                                                    <Tooltip title="Aktivieren">
                                                        <span>
                                                            <IconButton
                                                                onClick={() => {
                                                                    fetch(
                                                                        'https://localhost:5000/activate/' +
                                                                            tableMeta
                                                                                .rowData[0]
                                                                    ).then(
                                                                        function (
                                                                            response
                                                                        ) {
                                                                            return response.json()
                                                                        }
                                                                    )
                                                                }}
                                                            >
                                                                <TipsAndUpdates />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                </div>
                                            )
                                        }
                                    },
                                },
                            },
                        ]}
                        options={{
                            responsive: 'scrollFullHeight',
                            filter: false,
                            print: false,
                            selectableRows: 'none',
                            rowsPerPageOptions: [10, 25, 50, 100, 250],
                        }}
                    />
                ) : (
                    <LinearProgress />
                )}
            </div>
        )
    }
}

// Specifies the default values for props:
Dashboard.defaultProps = {
    routes: {
        routes: [
            {
                name: 'default',
                path: '/',
                exact: true,
                component: <LinearProgress />,
                admin: false,
                icon: null,
                hide: true,
            },
        ],
    },
}

export default withStyles(styles, { withTheme: true })(Dashboard)
