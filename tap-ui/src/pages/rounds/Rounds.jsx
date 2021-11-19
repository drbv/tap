import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import MUIDataTable from 'mui-datatables'
import {
    LinearProgress,
    Paper,
    Button,
    Tooltip,
    IconButton,
} from '@material-ui/core'
import withStyles from '@material-ui/core/es/styles/withStyles'
import { Edit, Delete, PeopleAlt } from '@material-ui/icons'
import * as Database from '../../Database'
import RoundSetDialog from './RoundSetDialog'
import RoundDialog from './RoundDialog'
import SubRoundsDialog from './SubRoundsDialog'

const styles = (theme) => ({
    root: {
        flexGrow: 1,
        padding: 30,
    },
    table: {
        margin: '11px',
        marginBottom: '80px',
    },
    newRoundField: {
        margin: '11px',
    },
    newRoundButton: {
        margin: 10,
    },
})

class Rounds extends Component {
    constructor(props) {
        super(props)

        this.state = {
            newRoundSetOpen: false,
            roundSetToEdit: null,
            roundsets: null,
            newRoundOpen: false,
            rountToEdit: null,
            rounds: null,
            subRoundsOpen: false,
            subRoundPropId: null,
        }

        this.subs = []
    }

    async componentDidMount() {
        this.setState({ db: await Database.getClientDb() })

        const sub = await this.state.db.rounds.find().$.subscribe((rounds) => {
            if (!rounds) {
                return
            }
            console.log('reload rounds-list ')
            console.dir(rounds)
            this.setState({
                rounds,
            })
        })
        this.subs.push(sub)
    }

    componentWillUnmount() {
        // Unsubscribe from all subscriptions
        this.subs.forEach((sub) => sub.unsubscribe())
    }

    async deleteRoundSet(id) {
        await this.state.db.rounds
            .findOne({
                selector: {
                    id: id,
                },
            })
            .remove()
    }

    render() {
        const { classes } = this.props
        const {
            rounds,
            roundToEdit,
            newRoundSetOpen,
            newRoundOpen,
            subRoundsOpen,
            subRoundPropId,
        } = this.state

        return (
            <div>
                <Paper className={classes.newRoundField}>
                    <Button
                        className={classes.newRoundButton}
                        color="inherit"
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                            this.setState({ newRoundSetOpen: true })
                        }}
                    >
                        Rundenaufteilung erstellen
                    </Button>
                    <Button
                        className={classes.newRoundButton}
                        color="inherit"
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                            this.setState({ newRoundOpen: true })
                        }}
                    >
                        Runde erstellen
                    </Button>
                </Paper>
                <RoundSetDialog
                    open={newRoundSetOpen}
                    handleClose={() =>
                        this.setState({
                            newRoundSetOpen: false,
                        })
                    }
                />
                <RoundDialog
                    open={newRoundOpen}
                    roundToEdit={roundToEdit}
                    handleClose={() => this.setState({ newRoundOpen: false })}
                />
                <SubRoundsDialog
                    open={subRoundsOpen}
                    subRoundPropId={subRoundPropId}
                    handleClose={() =>
                        this.setState({
                            subRoundsOpen: false,
                        })
                    }
                />
                {rounds != null ? (
                    <MUIDataTable
                        className={classes.table}
                        data={rounds}
                        columns={[
                            {
                                name: 'id',
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: 'name',
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                            },
                            {
                                name: 'numberSubRounds',
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                            },
                            {
                                name: 'evaluationTemplateId',
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                            },
                            {
                                name: 'judgeIds',
                                options: {
                                    filter: false,
                                    excluded: true,
                                    sort: true,
                                },
                            },
                            {
                                name: 'observerIds',
                                options: {
                                    filter: false,
                                    excluded: true,
                                    sort: true,
                                },
                            },
                            {
                                name: 'status',
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                            },
                            {
                                name: 'aktionen',
                                options: {
                                    filter: false,
                                    sort: false,
                                    customBodyRender: (
                                        value,
                                        tableMeta,
                                        updateValue
                                    ) => {
                                        if (tableMeta.rowData != null) {
                                            return (
                                                <div>
                                                    <Tooltip title="Paare hinzufügen">
                                                        <span>
                                                            <IconButton
                                                                onClick={() => {
                                                                    this.setState(
                                                                        {
                                                                            subRoundPropId:
                                                                                tableMeta
                                                                                    .rowData[0],
                                                                            subRoundsOpen:
                                                                                !subRoundsOpen,
                                                                        }
                                                                    )
                                                                }}
                                                            >
                                                                <PeopleAlt />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                    <Tooltip title="Bearbeiten">
                                                        <span>
                                                            <IconButton
                                                                onClick={() => {
                                                                    this.setState(
                                                                        {
                                                                            newRoundOpen:
                                                                                !newRoundOpen,
                                                                            roundToEdit:
                                                                                {
                                                                                    id: tableMeta
                                                                                        .rowData[0],
                                                                                    name: tableMeta
                                                                                        .rowData[1],
                                                                                    numberSubRounds:
                                                                                        tableMeta
                                                                                            .rowData[2],
                                                                                    evaluationTemplateId:
                                                                                        tableMeta
                                                                                            .rowData[3],
                                                                                    judgeIds:
                                                                                        tableMeta
                                                                                            .rowData[4],
                                                                                    observerIds:
                                                                                        tableMeta
                                                                                            .rowData[5],
                                                                                    status: tableMeta
                                                                                        .rowData[6],
                                                                                },
                                                                        }
                                                                    )
                                                                }}
                                                            >
                                                                <Edit />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                    <Tooltip title="Entfernen">
                                                        <span>
                                                            <IconButton
                                                                onClick={() => {
                                                                    this.deleteRound(
                                                                        tableMeta
                                                                            .rowData[0]
                                                                    )
                                                                }}
                                                            >
                                                                <Delete />
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
Rounds.defaultProps = {
    routes: {
        routes: [
            {
                name: 'default',
                path: '/rounds',
                exact: true,
                component: <LinearProgress />,
                admin: false,
                icon: null,
                hide: true,
            },
        ],
    },
}

export default withStyles(styles, { withTheme: true })(withRouter(Rounds))
