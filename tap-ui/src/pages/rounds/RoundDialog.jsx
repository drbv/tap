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
    IconButton,
    FormHelperText,
    FormControl,
    CircularProgress,
    Tooltip,
} from '@material-ui/core'

import { BlurOn, Delete, Add } from '@material-ui/icons'

const styles = (theme) => ({
    inputContent: {
        marginTop: 20,
    },
    flexboxContainer: {
        display: 'flex',
        'align-items': 'center',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
})

class RoundDialog extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            localRound: null,
            evaluations: null,
        }
        this.subs = []
    }

    async componentDidMount() {
        this.setState({ db: await Database.getClientDb() })

        const sub = await this.state.db.evaluations
            .find()
            .$.subscribe((evaluations) => {
                if (!evaluations) {
                    return
                }
                console.log('reload evaluations-list ')
                console.dir(evaluations)
                this.setState({
                    evaluations,
                })
            })
        this.subs.push(sub)
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.open !== this.props.open) {
            if (this.props.roundToEdit) {
                this.setState({ localRound: this.props.roundToEdit })
            } else {
                this.setState({
                    localRound: {
                        id: Date.now().toString(),
                    },
                })
            }
        }
    }

    componentWillUnmount() {
        // Unsubscribe from all subscriptions
        this.subs.forEach((sub) => sub.unsubscribe())
    }

    async upsertRound() {
        await this.state.db.rounds.upsert(this.state.localRound)
    }

    render() {
        const { classes } = this.props
        const { localRound } = this.state

        return localRound ? (
            <div>
                <Dialog
                    open={this.props.open}
                    onClose={() => this.props.handleClose()}
                    aria-labelledby="form-dialog-title"
                    scroll="body"
                >
                    <DialogTitle id="form-dialog-title">
                        Runde anlegen / bearbeiten
                    </DialogTitle>
                    <DialogContent dividers>
                        <TextField
                            margin="dense"
                            id="name"
                            name="name"
                            Title
                            value={localRound.name}
                            required={true}
                            onChange={(e) => {
                                this.setState((prevState) => {
                                    let localRound = Object.assign(
                                        {},
                                        prevState.localRound
                                    ) // creating copy of state variable
                                    localRound.name = e.target.value // update the name property, assign a new value
                                    return { localRound } // return new object
                                })
                            }}
                            helperText="Name der Runde"
                            label="Name"
                            type="text"
                            autoComplete="name"
                            fullWidth
                            className={classes.inputContent}
                        />
                        <TextField
                            margin="dense"
                            id="name"
                            name="name"
                            Title
                            value={localRound.numberSubRounds}
                            required={true}
                            onChange={(e) => {
                                this.setState((prevState) => {
                                    let localRound = Object.assign(
                                        {},
                                        prevState.localRound
                                    ) // creating copy of state variable
                                    localRound.numberSubRounds = e.target.value // update the name property, assign a new value
                                    return { localRound } // return new object
                                })
                            }}
                            helperText="Anzahl Teilrunden"
                            label="Teilrunden"
                            type="number"
                            autoComplete="name"
                            fullWidth
                            className={classes.inputContent}
                        />
                        <div className={classes.inputContent}>
                            <InputLabel
                                required={true}
                                shrink={true}
                                className={classes.inputContent}
                                htmlFor="role-select"
                            >
                                Wertungsbogen
                            </InputLabel>
                            <Select
                                fullWidth
                                inputProps={{
                                    name: 'evaluation',
                                    id: 'evaluation-select',
                                }}
                                value={localRound.evaluationTemplateId}
                                onChange={(e) => {
                                    this.setState((prevState) => {
                                        let localRound = Object.assign(
                                            {},
                                            prevState.localRound
                                        ) // creating copy of state variable
                                        localRound.evaluationTemplateId =
                                            e.target.value // update the name property, assign a new value
                                        return { localRound } // return new object
                                    })
                                }}
                            >
                                {this.state.evaluations &&
                                    this.state.evaluations.map((evaluation) => {
                                        return (
                                            <MenuItem value={evaluation.id}>
                                                {evaluation.name}
                                            </MenuItem>
                                        )
                                    })}
                            </Select>
                        </div>
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
                                value={localRound.status}
                                onChange={(e) => {
                                    this.setState((prevState) => {
                                        let localRound = Object.assign(
                                            {},
                                            prevState.localRound
                                        ) // creating copy of state variable
                                        localRound.status = e.target.value // update the name property, assign a new value
                                        return { localRound } // return new object
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
                                this.upsertRound()
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

RoundDialog.propTypes = {
    /**
     * dialog open or closed
     */
    open: PropTypes.bool.isRequired,
    /**
     * function to close dialog
     */
    handleClose: PropTypes.func.isRequired,
}

export default withStyles(styles, { withTheme: true })(withProps(RoundDialog))
