//HOC and util
import React from "react";
import { PropTypes } from "prop-types";
import withStyles from "@material-ui/core/es/styles/withStyles";

import { isRxCollection, isRxDatabase, isRxDocument } from "rxdb";

import withProps from "../../components/HOC";
import * as Database from "../../Database";

//components and libraries
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputLabel,
    Input,
    MenuItem,
    Select,
    Slider,
    Typography,
    IconButton,
    Container,
    Divider,
    FormHelperText,
    FormControl,
    CircularProgress,
} from "@material-ui/core";
import { Delete, Add } from "@material-ui/icons";
import { Tooltip } from "@material-ui/core";

const styles = (theme) => ({
    inputContent: {
        marginTop: 20,
    },
    root: {
        padding: theme.spacing(2),
        display: "flex",
        flexDirection: "column",
        margin: "11px",
    },
    row: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    flexboxContainer: {
        display: "flex",
        "align-items": "center",
    },
});

class RoundSetDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            localRoundSet: null,
            numberCouples: null,
            suggestedNumber: null,
            roundLimitations: [],
        };
        this.subs = [];
    }

    async componentDidMount() {
        this.setState({ db: await Database.getClientDb() });
    }

    async loadNumberCouples(className) {
        const sub = await this.state.db.couples
            .find({
                selector: {
                    class: className,
                },
            })
            .$.subscribe((value) => {
                if (!value) {
                    return;
                }
                console.log("reload number couples in class");
                console.dir(value.length);
                this.setState({
                    numberCouples: value.length,
                });
            });
        this.subs.push(sub);
        this.setState({ suggestedNumber: this.state.numberCouples });
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.open !== this.props.open) {
            if (this.props.roundSetToEdit) {
                this.setState({ localRoundSet: this.props.roundSetToEdit });
            } else {
                this.setState({
                    localRoundSet: {
                        id: Date.now().toString(),
                        class: "",
                        stationId: "",
                    },
                });
            }
        }
    }

    async atomicUpsertRoundSet() {
        await this.state.db.roundsets.atomicUpsert(this.state.localRoundSet);
    }

    buildRoundLimitations(numberCouples) {
        let localRoundLimitations = [];
        localRoundLimitations.push({ limit: numberCouples });
        for (let i = 1; numberCouples > 7; i++) {
            if ((numberCouples / 100) * 90 > (numberCouples / 100) * 10) {
                let newLimit = Math.ceil(
                    ((numberCouples / 100) * 90 + (numberCouples / 100) * 10) /
                        2
                );
                numberCouples = newLimit;
                localRoundLimitations.push({ limit: newLimit });
            } else {
                localRoundLimitations.push({ limit: numberCouples });
            }
        }
        this.setState({ roundLimitations: localRoundLimitations });
    }

    render() {
        const { classes } = this.props;
        const {
            localRoundSet,
            roundLimitations,
            suggestedNumber,
            numberCouples,
        } = this.state;

        return localRoundSet ? (
            <div>
                <Dialog
                    open={this.props.open}
                    onClose={() => this.props.handleClose()}
                    aria-labelledby='form-dialog-title'
                    scroll='body'
                >
                    <DialogTitle id='form-dialog-title'>
                        Nutzer anlegen / bearbeiten
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
                                value={localRoundSet.class}
                                onChange={(e) => {
                                    this.setState((prevState) => {
                                        let localRoundSet = Object.assign(
                                            {},
                                            prevState.localRoundSet
                                        ); // creating copy of state variable
                                        localRoundSet.class = e.target.value; // update the name property, assign a new value
                                        this.loadNumberCouples(e.target.value);
                                        return { localRoundSet }; // return new object
                                    });
                                }}
                            >
                                <MenuItem value='sClass'>Schüler</MenuItem>
                                <MenuItem value='jClass'>Junioren</MenuItem>
                                <MenuItem value='cClass'>C-Klasse</MenuItem>
                                <MenuItem value='bClass'>B-Klasse</MenuItem>
                                <MenuItem value='aClass'>A-Klasse</MenuItem>
                            </Select>
                            {localRoundSet && localRoundSet.class && (
                                <div>
                                    <Input
                                        className={classes.input}
                                        value={this.state.suggestedNumber}
                                        margin='dense'
                                        onChange={(e) => {
                                            this.setState({
                                                suggestedNumber: e.target.value,
                                            });
                                        }}
                                        inputProps={{
                                            step: 1,
                                            min: 0,
                                            max: 1000,
                                            type: "number",
                                            "aria-labelledby": "input-slider",
                                        }}
                                    />
                                    <Button
                                        className={classes.newRoundButton}
                                        color='inherit'
                                        variant='outlined'
                                        color='primary'
                                        onClick={() => {
                                            this.buildRoundLimitations(
                                                suggestedNumber
                                            );
                                        }}
                                    >
                                        Rundenanzahl berechnen
                                    </Button>
                                </div>
                            )}
                            {roundLimitations.map((roundLimit, index) => {
                                return (
                                    <div>
                                        <Typography
                                            id='discrete-slider'
                                            gutterBottom
                                        >
                                            {"Runde " + (index + 1)}
                                        </Typography>
                                        <div className={classes.row}>
                                            <Slider
                                                defaultValue={roundLimit.limit}
                                                aria-labelledby='discrete-slider-small-steps'
                                                step={1}
                                                min={0}
                                                max={suggestedNumber}
                                                onDragStop={(e) => {
                                                    let localRoundLimitations =
                                                        this.state
                                                            .roundLimitations;
                                                    localRoundLimitations[
                                                        index
                                                    ].limit = parseInt(
                                                        e.target.value
                                                    );
                                                    this.setState({
                                                        roundLimitations:
                                                            localRoundLimitations,
                                                    });
                                                }}
                                                valueLabelDisplay='auto'
                                            />
                                            <Tooltip title='Entfernen'>
                                                <IconButton
                                                    onClick={() => {
                                                        let localRoundLimitations =
                                                            this.state
                                                                .roundLimitations;
                                                        localRoundLimitations.splice(
                                                            index,
                                                            1
                                                        );
                                                        this.setState({
                                                            roundLimitations:
                                                                localRoundLimitations,
                                                        });
                                                    }}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </div>
                                );
                            })}
                            <Tooltip title='Weitere Runde'>
                                <IconButton
                                    onClick={() => {
                                        let localRoundLimitations =
                                            this.state.roundLimitations;
                                        localRoundLimitations.push({
                                            limit: 0,
                                        });
                                        this.setState({
                                            roundLimitations:
                                                localRoundLimitations,
                                        });
                                    }}
                                >
                                    <Add />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                this.props.handleClose();
                            }}
                            color='secondary'
                            variant='contained'
                        >
                            abbrechen
                        </Button>
                        <Button
                            disabled={this.state.disabled}
                            onClick={() => {
                                this.atomicUpsertRoundSet();
                                this.props.handleClose();
                            }}
                            color='primary'
                            variant='contained'
                        >
                            speichern
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        ) : (
            ""
        );
    }
}

RoundSetDialog.propTypes = {
    /**
     * dialog open or closed
     */
    open: PropTypes.bool.isRequired,
    /**
     * function to close dialog
     */
    handleClose: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(
    withProps(RoundSetDialog)
);
