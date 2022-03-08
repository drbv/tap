//HOC and util
import React from "react";
import { PropTypes } from "prop-types";
import withStyles from "@material-ui/core/es/styles/withStyles";
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
} from "@material-ui/core";

import * as Database from "../../Database";

const styles = (theme) => ({
    inputContent: {
        marginTop: 20,
    },
    flexboxContainer: {
        display: "flex",
        "align-items": "center",
    },
});

class AthleteDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            localCouple: null,
        };
    }

    async componentDidMount() {
        this.setState({ db: await Database.getClientDb() });
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.open !== this.props.open) {
            if (this.props.coupleToEdit) {
                this.setState({ localCouple: this.props.coupleToEdit });
            } else {
                this.setState({
                    localCouple: {
                        id: Date.now().toString(),
                    },
                });
            }
        }
    }

    async atomicUpsertCouple() {
        await this.state.db.couples.atomicUpsert(this.state.localCouple);
    }

    render() {
        const { classes } = this.props;
        const { localCouple } = this.state;

        return localCouple ? (
            <div>
                <Dialog
                    open={this.props.open}
                    onClose={() => this.props.handleClose()}
                    aria-labelledby='form-dialog-title'
                    scroll='body'
                >
                    <DialogTitle id='form-dialog-title'>
                        Tanzpaar anlegen / bearbeiten
                    </DialogTitle>
                    <DialogContent dividers>
                        <div className={classes.inputContent}>
                            <InputLabel
                                required={true}
                                shrink={true}
                                className={classes.inputContent}
                                htmlFor='class-select'
                            >
                                Tanzklasse
                            </InputLabel>
                            <Select
                                fullWidth
                                inputProps={{
                                    name: "class",
                                    id: "class-select",
                                }}
                                value={localCouple.class}
                                onChange={(e) => {
                                    this.setState((prevState) => {
                                        let localCouple = Object.assign(
                                            {},
                                            prevState.localCouple
                                        ); // creating copy of state variable
                                        localCouple.class = e.target.value; // update the name property, assign a new value
                                        return { localCouple }; // return new object
                                    });
                                }}
                            >
                                <MenuItem value='s1Class'>Schüler-1</MenuItem>
                                <MenuItem value='sClass'>Schüler</MenuItem>
                                <MenuItem value='jClass'>Junioren</MenuItem>
                                <MenuItem value='cClass'>C-Klasse</MenuItem>
                                <MenuItem value='bClass'>B-Klasse</MenuItem>
                                <MenuItem value='aClass'>A-Klasse</MenuItem>
                            </Select>
                        </div>
                        <TextField
                            autoFocus
                            margin='dense'
                            id='number'
                            name='Startnummer'
                            value={localCouple.number}
                            required={false}
                            onChange={(e) => {
                                this.setState((prevState) => {
                                    let localCouple = Object.assign(
                                        {},
                                        prevState.localCouple
                                    ); // creating copy of state variable
                                    localCouple.number = e.target.value; // update the name property, assign a new value
                                    return { localCouple }; // return new object
                                });
                            }}
                            helperText='Startnummer des Tanzpaares'
                            label='Startnummer'
                            type='text'
                            fullWidth
                            className={classes.inputContent}
                        />
                        <TextField
                            autoFocus
                            margin='dense'
                            id='nameOne'
                            name='Vorname Dame'
                            value={localCouple.nameOneFirst}
                            onChange={(e) => {
                                this.setState((prevState) => {
                                    let localCouple = Object.assign(
                                        {},
                                        prevState.localCouple
                                    ); // creating copy of state variable
                                    localCouple.nameOneFirst = e.target.value; // update the name property, assign a new value
                                    return { localCouple }; // return new object
                                });
                            }}
                            required={true}
                            helperText='Vorname der Dame'
                            label='Vorname der Dame'
                            type='text'
                            fullWidth
                            className={classes.inputContent}
                        />
                        <TextField
                            autoFocus
                            margin='dense'
                            id='nameOne'
                            name='Nachname Dame'
                            value={localCouple.nameOneSecond}
                            onChange={(e) => {
                                this.setState((prevState) => {
                                    let localCouple = Object.assign(
                                        {},
                                        prevState.localCouple
                                    ); // creating copy of state variable
                                    localCouple.nameOneSecond = e.target.value; // update the name property, assign a new value
                                    return { localCouple }; // return new object
                                });
                            }}
                            required={true}
                            helperText='Nachname der Dame'
                            label='Nachname der Dame'
                            type='text'
                            fullWidth
                            className={classes.inputContent}
                        />
                        <TextField
                            autoFocus
                            margin='dense'
                            id='nameOne'
                            name='Vorname Herr'
                            value={localCouple.nameTwoFirst}
                            onChange={(e) => {
                                this.setState((prevState) => {
                                    let localCouple = Object.assign(
                                        {},
                                        prevState.localCouple
                                    ); // creating copy of state variable
                                    localCouple.nameTwoFirst = e.target.value; // update the name property, assign a new value
                                    return { localCouple }; // return new object
                                });
                            }}
                            required={true}
                            helperText='Vorname des Herrn'
                            label='Vorname des Herrn'
                            type='text'
                            fullWidth
                            className={classes.inputContent}
                        />
                        <TextField
                            autoFocus
                            margin='dense'
                            id='nameOne'
                            name='Nachname Dame'
                            value={localCouple.nameTwoSecond}
                            onChange={(e) => {
                                this.setState((prevState) => {
                                    let localCouple = Object.assign(
                                        {},
                                        prevState.localCouple
                                    ); // creating copy of state variable
                                    localCouple.nameTwoSecond = e.target.value; // update the name property, assign a new value
                                    return { localCouple }; // return new object
                                });
                            }}
                            required={true}
                            helperText='Nachname des Herrn'
                            label='Nachname des Herrn'
                            type='text'
                            fullWidth
                            className={classes.inputContent}
                        />
                        <TextField
                            autoFocus
                            margin='dense'
                            id='club'
                            name='Vereinsnummer'
                            value={localCouple.clubNumber}
                            onChange={(e) => {
                                this.setState((prevState) => {
                                    let localCouple = Object.assign(
                                        {},
                                        prevState.localCouple
                                    ); // creating copy of state variable
                                    localCouple.clubNumber = e.target.value; // update the name property, assign a new value
                                    return { localCouple }; // return new object
                                });
                            }}
                            required={false}
                            helperText='Vereinsnummer des Tanzpaares'
                            label='Vereinsnummer'
                            type='text'
                            fullWidth
                            className={classes.inputContent}
                        />
                        <TextField
                            autoFocus
                            margin='dense'
                            id='club'
                            name='Vereinsname'
                            value={localCouple.clubName}
                            onChange={(e) => {
                                this.setState((prevState) => {
                                    let localCouple = Object.assign(
                                        {},
                                        prevState.localCouple
                                    ); // creating copy of state variable
                                    localCouple.clubName = e.target.value; // update the name property, assign a new value
                                    return { localCouple }; // return new object
                                });
                            }}
                            required={false}
                            helperText='Vereinsname des Tanzpaares'
                            label='Vereinsname'
                            type='text'
                            fullWidth
                            className={classes.inputContent}
                        />
                        <TextField
                            autoFocus
                            margin='dense'
                            id='club'
                            name='Startbuchnummer'
                            value={localCouple.coupleNumber}
                            onChange={(e) => {
                                this.setState((prevState) => {
                                    let localCouple = Object.assign(
                                        {},
                                        prevState.localCouple
                                    ); // creating copy of state variable
                                    localCouple.coupleNumber = e.target.value; // update the name property, assign a new value
                                    return { localCouple }; // return new object
                                });
                            }}
                            required={false}
                            helperText='Startbuchnummer des Tanzpaares'
                            label='Startbuchnummer'
                            type='text'
                            fullWidth
                            className={classes.inputContent}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                this.props.handleClose();
                            }}
                            color='secondary'
                            variant='contained'
                        >
                            Abbrechen
                        </Button>
                        <Button
                            disabled={this.state.disabled}
                            onClick={() => {
                                this.atomicUpsertCouple();
                                this.props.handleClose();
                            }}
                            color='primary'
                            variant='contained'
                        >
                            Speichern
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        ) : (
            ""
        );
    }
}

AthleteDialog.propTypes = {
    /**
     * dialog open or closed
     */
    open: PropTypes.bool.isRequired,
    /**
     * function to close dialog
     */
    handleClose: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(AthleteDialog);
