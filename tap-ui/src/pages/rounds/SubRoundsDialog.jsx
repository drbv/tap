//HOC and util
import React from 'react'
import { PropTypes } from 'prop-types'
import withStyles from '@material-ui/core/es/styles/withStyles'

import { isRxCollection, isRxDatabase, isRxDocument } from 'rxdb'

import withProps from '../../components/HOC'
import * as Database from '../../Database'
import NewSubRoundDialog from './NewSubRoundDialog'

import MUIDataTable from 'mui-datatables'

//components and libraries
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputLabel,
    MenuItem,
    Select,
    FormHelperText,
    FormControl,
    LinearProgress,
    IconButton,
    Paper,
    Grid,
} from '@material-ui/core'

import { BlurOn, Edit, Delete } from '@material-ui/icons'
import { Tooltip } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

const styles = (theme) => ({
    inputContent: {
        marginTop: 20,
    },
    flexboxContainer: {
        display: 'flex',
        'align-items': 'center',
    },
    newSubRoundButton: {
        marginBottom: 10,
    },
})

class SubRoundsDialog extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            round: null,
            judges: null,
            subrounds: null,
            newSubRoundOpen: false,
            subRoundToEdit: null,
            roundId: null,
        }
        this.subs = []
    }

    async componentDidMount() {
        this.setState({ db: await Database.getClientDb() })
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.open !== this.props.open) {
            if (this.props.subRoundPropId) {
                this.setState({ roundId: this.props.subRoundPropId })

                const sub = await this.state.db.rounds
                    .findOne({
                        selector: { id: this.props.subRoundPropId },
                    })
                    .$.subscribe((round) => {
                        if (!round) {
                            return
                        }
                        console.log('reload round-object')
                        console.dir(round)
                        this.setState({
                            round,
                        })
                    })
                this.subs.push(sub)

                if (this.state.round && this.state.round.judgeId) {
                    const sub0 = await this.state.db.users
                        .find({
                            selector: {
                                role: 'judge',
                            },
                        })
                        .$.subscribe((judges) => {
                            if (!judges) {
                                return
                            }
                            console.log('reload judge-list')
                            console.dir(judges)
                            this.setState({
                                judges,
                            })
                        })
                    this.subs.push(sub0)
                }

                const sub1 = await this.state.db.subrounds
                    .find({ selector: { roundId: this.props.subRoundPropId } })
                    .$.subscribe((subrounds) => {
                        if (!subrounds) {
                            return
                        }
                        console.log('reload subrounds-list ')
                        console.dir(subrounds)
                        this.setState({
                            subrounds,
                        })
                    })
                this.subs.push(sub1)
            } else {
                this.props.handleClose()
            }
        }
    }

    async upsertSubRounds() {
        await this.state.db.subrounds.upsert(this.state.subrounds)
    }

    render() {
        const { classes, subRoundPropId } = this.props
        const { subrounds, newSubRoundOpen, subRoundToEdit, judges } =
            this.state

        return (
            <div>
                <Dialog
                    fullScreen
                    open={this.props.open}
                    onClose={() => this.props.handleClose()}
                    aria-labelledby="form-dialog-title"
                    scroll="body"
                >
                    <DialogTitle id="form-dialog-title">
                        Teilrunden bearbeiten / hinzufügen
                    </DialogTitle>
                    <DialogContent dividers>
                        <Paper>
                            <Grid
                                container
                                alignItems="center"
                                justifyContent="flex-start"
                            >
                                <Grid item>
                                    <Button
                                        className={classes.newSubRoundButton}
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => {
                                            this.setState({
                                                newSubRoundOpen: true,
                                            })
                                        }}
                                    >
                                        Teilrunde erstellen
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        className={classes.newSubRoundButton}
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => {
                                            this.setState({
                                                roundJudgeOpen: true,
                                            })
                                        }}
                                    ></Button>
                                </Grid>
                                <Grid item>
                                    {this.state.roundJudgeOpen && (
                                        <div>
                                            <Autocomplete
                                                className={classes.margin}
                                                id={
                                                    'judgeSelector' +
                                                    this.state.round.id
                                                }
                                                options={this.state.judges}
                                                getOptionLabel={(option) =>
                                                    option.name
                                                }
                                                onChange={(event, newValue) => {
                                                    this.setState({
                                                        newJudge: newValue.id,
                                                    })
                                                }}
                                                autoComplete
                                                autoSelect
                                                disableClearable
                                                style={{ width: 400 }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Name"
                                                        variant="outlined"
                                                    />
                                                )}
                                            />
                                        </div>
                                    )}
                                </Grid>
                            </Grid>
                        </Paper>
                        <NewSubRoundDialog
                            open={newSubRoundOpen}
                            subRoundPropId={subRoundPropId}
                            subRoundToEdit={subRoundToEdit}
                            handleClose={() =>
                                this.setState({
                                    newSubRoundOpen: false,
                                })
                            }
                        />
                        {judges && (
                            <MUIDataTable
                                className={classes.table}
                                data={judges}
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
                                        },
                                    },
                                    {
                                        name: 'role',
                                        options: {
                                            filter: false,
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
                        )}
                        {subrounds ? (
                            <MUIDataTable
                                className={classes.table}
                                data={subrounds}
                                columns={[
                                    {
                                        name: 'id',
                                        options: {
                                            filter: false,
                                        },
                                    },
                                    {
                                        name: 'roundId',
                                        options: {
                                            filter: false,
                                            sort: true,
                                        },
                                    },
                                    {
                                        name: 'number',
                                        options: {
                                            filter: false,
                                            sort: true,
                                        },
                                    },
                                    {
                                        name: 'coupleIds',
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
                                        name: 'Aktionen',
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
                                                            <Tooltip title="Bearbeiten">
                                                                <span>
                                                                    <IconButton
                                                                        onClick={() => {
                                                                            this.setState(
                                                                                {
                                                                                    newSubRoundOpen:
                                                                                        !newSubRoundOpen,
                                                                                    subRoundToEdit:
                                                                                        {
                                                                                            id: tableMeta
                                                                                                .rowData[0],
                                                                                            roundId:
                                                                                                tableMeta
                                                                                                    .rowData[1],
                                                                                            number: tableMeta
                                                                                                .rowData[2],
                                                                                            coupleIds:
                                                                                                tableMeta
                                                                                                    .rowData[3],
                                                                                            status: tableMeta
                                                                                                .rowData[4],
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
                                                                            this.deleteUser(
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
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                this.props.handleClose()
                            }}
                            color="secondary"
                            variant="contained"
                        >
                            schließen
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

SubRoundsDialog.propTypes = {
    /**
     * dialog open or closed
     */
    open: PropTypes.bool.isRequired,
    /**
     * function to close dialog
     */
    handleClose: PropTypes.func.isRequired,
}

export default withStyles(styles, { withTheme: true })(
    withProps(SubRoundsDialog)
)
