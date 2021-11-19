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

class SubRoundDialog extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            localSubRound: null,
            couples: null,
        }

        this.subs = []
    }

    async componentDidMount() {
        this.setState({ db: await Database.getClientDb() })
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.open !== this.props.open) {
            if (this.props.subRoundToEdit) {
                this.setState({ localSubRound: this.props.subRoundToEdit })
            } else {
                this.setState({
                    localSubRound: {
                        id: Date.now().toString(),
                        roundId: this.props.subRoundPropId,
                    },
                })
            }
        }
    }

    async upsertSubRound() {
        await this.state.db.subrounds.upsert(this.state.localSubRound)
    }

    render() {
        const { classes } = this.props
        const { localSubRound } = this.state

        return localSubRound ? (
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
                            value={localSubRound.number}
                            required={true}
                            onChange={(e) => {
                                this.setState((prevState) => {
                                    let localSubRound = Object.assign(
                                        {},
                                        prevState.localSubRound
                                    ) // creating copy of state variable
                                    localSubRound.number = e.target.value // update the name property, assign a new value
                                    return { localSubRound } // return new object
                                })
                            }}
                            helperText="Nummer der Teilrunde"
                            label="Nummer"
                            type="number"
                            autoComplete="name"
                            fullWidth
                            className={classes.inputContent}
                        />
                        {localSubRound &&
                            localSubRound.coupleIds &&
                            localSubRound.coupleIds.map((couple, index) => {
                                return (
                                    <TextField
                                        margin="dense"
                                        id="name"
                                        name="name"
                                        Title
                                        value={couple}
                                        required={true}
                                        onChange={(e, newValue) => {
                                            let localSubRoundCopy =
                                                localSubRound
                                            localSubRoundCopy.coupleIds[index] =
                                                e.target.value
                                            this.setState({
                                                localSubRound:
                                                    localSubRoundCopy,
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
                                    let localSubRoundCopy = JSON.parse(
                                        JSON.stringify(localSubRound)
                                    )
                                    localSubRoundCopy.coupleIds
                                        ? localSubRoundCopy.coupleIds.push('')
                                        : (localSubRoundCopy.coupleIds = [''])
                                    this.setState({
                                        localSubRound: localSubRoundCopy,
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
                                value={localSubRound.status}
                                onChange={(e) => {
                                    this.setState((prevState) => {
                                        let localSubRound = Object.assign(
                                            {},
                                            prevState.localSubRound
                                        ) // creating copy of state variable
                                        localSubRound.status = e.target.value // update the name property, assign a new value
                                        return { localSubRound } // return new object
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
                                this.upsertSubRound()
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

SubRoundDialog.propTypes = {
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
    withProps(SubRoundDialog)
)
