//HOC and util
import React from 'react'
import { PropTypes } from 'prop-types'
import withStyles from '@material-ui/core/es/styles/withStyles'

import { isRxCollection, isRxDatabase, isRxDocument } from 'rxdb'

import withProps from '../../components/HOC'
import * as Database from '../../Database'

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
    CircularProgress,
    IconButton,
} from '@material-ui/core'

import { Autocomplete } from '@material-ui/lab'

import { BlurOn, Add } from '@material-ui/icons'
import { Tooltip } from '@material-ui/core'

const styles = (theme) => ({
    inputContent: {
        marginTop: 20,
    },
    flexboxContainer: {
        display: 'flex',
        'align-items': 'center',
    },
})

class RoundJudgeDialog extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            localRoundJudge: null,
            couples: null,
        }

        this.subs = []
    }

    async componentDidMount() {
        this.setState({ db: await Database.getClientDb() })
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.open !== this.props.open) {
            if (this.props.roundJudgeToEdit) {
                this.setState({ localRoundJudge: this.props.roundJudgeToEdit })
            } else {
                this.setState({
                    localRoundJudge: {
                        id: Date.now().toString(),
                        roundId: this.props.roundJudgePropId,
                    },
                })
            }
        }
    }

    async upsertRoundJudge() {
        await this.state.db.roundjudges.upsert(this.state.localRoundJudge)
    }

    render() {
        const { classes } = this.props
        const { localRoundJudge } = this.state

        return localRoundJudge ? (
            <div>
                <Dialog
                    open={this.props.open}
                    onClose={() => this.props.handleClose()}
                    aria-labelledby="form-dialog-title"
                    scroll="body"
                >
                    <DialogTitle id="form-dialog-title">
                        Teilrunde anlegen / bearbeiten
                    </DialogTitle>
                    <DialogContent dividers>
                        <TextField
                            margin="dense"
                            id="name"
                            name="name"
                            Title
                            value={localRoundJudge.number}
                            required={true}
                            onChange={(e) => {
                                this.setState((prevState) => {
                                    let localRoundJudge = Object.assign(
                                        {},
                                        prevState.localRoundJudge
                                    ) // creating copy of state variable
                                    localRoundJudge.number = e.target.value // update the name property, assign a new value
                                    return { localRoundJudge } // return new object
                                })
                            }}
                            helperText="Nummer der Teilrunde"
                            label="Nummer"
                            type="number"
                            autoComplete="name"
                            fullWidth
                            className={classes.inputContent}
                        />
                        {localRoundJudge &&
                            localRoundJudge.coupleIds &&
                            localRoundJudge.coupleIds.map((couple, index) => {
                                return (
                                    <TextField
                                        margin="dense"
                                        id="name"
                                        name="name"
                                        Title
                                        value={couple}
                                        required={true}
                                        onChange={(e, newValue) => {
                                            let localRoundJudgeCopy =
                                                localRoundJudge
                                            localRoundJudgeCopy.coupleIds[
                                                index
                                            ] = e.target.value
                                            this.setState({
                                                localRoundJudge:
                                                    localRoundJudgeCopy,
                                            })
                                        }}
                                        helperText="Tanzpaar ID"
                                        label="Tanzpaar"
                                        type="text"
                                        autoComplete="name"
                                        fullWidth
                                        className={classes.inputContent}
                                    />
                                )
                            })}
                        <Tooltip title="Tanzpaar hinzufügen">
                            <IconButton
                                onClick={() => {
                                    let localRoundJudgeCopy = JSON.parse(
                                        JSON.stringify(localRoundJudge)
                                    )
                                    localRoundJudgeCopy.coupleIds
                                        ? localRoundJudgeCopy.coupleIds.push('')
                                        : (localRoundJudgeCopy.coupleIds = [''])
                                    this.setState({
                                        localRoundJudge: localRoundJudgeCopy,
                                    })
                                }}
                            >
                                <Add />
                            </IconButton>
                        </Tooltip>
                        <div className={classes.inputContent}>
                            <InputLabel
                                required={true}
                                shrink={true}
                                className={classes.inputContent}
                                htmlFor="role-select"
                            >
                                Status
                            </InputLabel>
                            <Select
                                fullWidth
                                inputProps={{
                                    name: 'status',
                                    id: 'status-select',
                                }}
                                value={localRoundJudge.status}
                                onChange={(e) => {
                                    this.setState((prevState) => {
                                        let localRoundJudge = Object.assign(
                                            {},
                                            prevState.localRoundJudge
                                        ) // creating copy of state variable
                                        localRoundJudge.status = e.target.value // update the name property, assign a new value
                                        return { localRoundJudge } // return new object
                                    })
                                }}
                            >
                                <MenuItem value="blocked">Fehlerhaft</MenuItem>
                                <MenuItem value="waiting">Vorbereitet</MenuItem>
                                <MenuItem value="running">Laufend</MenuItem>
                                <MenuItem value="dome">Abgeschlossen</MenuItem>
                            </Select>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                this.props.handleClose()
                            }}
                            color="secondary"
                            variant="contained"
                        >
                            abbrechen
                        </Button>
                        <Button
                            disabled={this.state.disabled}
                            onClick={() => {
                                this.upsertRoundJudge()
                                this.props.handleClose()
                            }}
                            color="primary"
                            variant="contained"
                        >
                            speichern
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        ) : (
            ''
        )
    }
}

RoundJudgeDialog.propTypes = {
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
    withProps(RoundJudgeDialog)
)
