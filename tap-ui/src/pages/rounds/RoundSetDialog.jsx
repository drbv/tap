//HOC and util
import React from "react";
import { PropTypes } from "prop-types";
import withStyles from "@material-ui/core/es/styles/withStyles";

import { isRxCollection, isRxDatabase, isRxDocument } from "rxdb";
import { withLocalize } from "react-localize-redux";

import withProps from "../../components/HOC";
import { getCollection, closeCollection } from "../../Database";

import athleteTranslation from "../../translations/athletes.json";

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
    Grid,
} from "@material-ui/core";
import { Delete, Add } from "@mui/icons-material";
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
            numberCouples: null,
            selectedClass: null,
            suggestedNumber: null,
            roundLimitations: [],
        };
        this.subs = [];
        this.props.addTranslation(athleteTranslation);
    }

    async loadNumberCouples(className) {
        let collection = await getCollection(
            "competition",
            this.props.competitionId
        );
        let value = await collection
            .find({
                selector: {
                    league: className,
                },
            })
            .exec();

        console.log("reload number couples in class");
        console.dir(value.length);
        this.setState({
            numberCouples: value.length,
            suggestedNumber: value.length,
        });
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

    atomicUpsertRoundSet() {
        const { selectedClass, roundLimitations } = this.state;
        getCollection("round", this.props.competitionId).then(
            async (collection) => {
                roundLimitations.map((round, index) => {
                    let roundType = "";
                    switch (index) {
                        case 0:
                            roundType = "qualifying";
                            break;
                        case roundLimitations.length - 1:
                            roundType = "finals";
                            break;
                        default:
                            roundType = "intermediate";
                    }
                    collection.atomicUpsert({
                        roundId: Date.now().toString() + index,
                        league: selectedClass,
                        roundType: roundType,
                        status: "blocked",
                    });
                });
            }
        );
    }

    buildRoundLimitations(numberCouples) {
        let localRoundLimitations = [];
        localRoundLimitations.push({ limit: numberCouples });
        for (let i = 1; numberCouples > 7; i++) {
            if ((numberCouples / 100) * 90 > (numberCouples / 100) * 40) {
                let newLimit = Math.ceil(
                    ((numberCouples / 100) * 90 + (numberCouples / 100) * 40) /
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

    renderSwitch(index) {
        switch (index) {
            case 0:
                return "Vorrunde";
            case this.state.roundLimitations.length - 1:
                return "Endrunde";
            default:
                return index + ". Zwischenrunde";
        }
    }

    render() {
        const { classes, translate } = this.props;
        const { selectedClass, roundLimitations, suggestedNumber } = this.state;

        return (
            <div>
                <Dialog
                    open={this.props.open}
                    onClose={() => this.props.handleClose()}
                    aria-labelledby="form-dialog-title"
                    scroll="body"
                >
                    <DialogTitle id="form-dialog-title">
                        Nutzer anlegen / bearbeiten
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="flex-end"
                            spacing={2}
                        >
                            <Grid item xs={3}>
                                <div className={classes.inputContent}>
                                    <InputLabel
                                        required={true}
                                        shrink={true}
                                        className={classes.inputContent}
                                        htmlFor="class-select"
                                    >
                                        Tanzklasse
                                    </InputLabel>
                                    <Select
                                        fullWidth
                                        inputProps={{
                                            name: "class",
                                            id: "class-select",
                                        }}
                                        value={selectedClass}
                                        onChange={(e) => {
                                            this.setState(
                                                {
                                                    selectedClass:
                                                        e.target.value,
                                                },
                                                () => {
                                                    this.loadNumberCouples(
                                                        e.target.value
                                                    );
                                                }
                                            );
                                            this.setState({
                                                roundLimitations: [],
                                            });
                                        }}
                                    >
                                        {[
                                            "RR_A",
                                            "RR_B",
                                            "RR_C",
                                            "RR_J",
                                            "RR_S",
                                            "RR_S1",
                                            "RR_S2",
                                        ].map((value) => {
                                            return (
                                                <MenuItem value={value}>
                                                    {translate(
                                                        "athlete.leagues." +
                                                            value
                                                    )}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </div>
                            </Grid>
                            <Grid item xs={3}>
                                <InputLabel
                                    required={true}
                                    shrink={true}
                                    className={classes.inputContent}
                                    htmlFor="number-select"
                                >
                                    Anzahl Paare
                                </InputLabel>
                                <Input
                                    disabled={!selectedClass}
                                    className={classes.input}
                                    value={this.state.suggestedNumber}
                                    margin="dense"
                                    onChange={(e) => {
                                        this.setState({
                                            suggestedNumber: e.target.value,
                                            roundLimitations: [],
                                        });
                                    }}
                                    inputProps={{
                                        name: "number",
                                        id: "number-select",
                                        step: 1,
                                        min: 0,
                                        max: 1000,
                                        type: "number",
                                        "aria-labelledby": "input-slider",
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    style={{ fontSize: "13px" }}
                                    disabled={!selectedClass}
                                    className={classes.newRoundButton}
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => {
                                        this.buildRoundLimitations(
                                            suggestedNumber
                                        );
                                    }}
                                >
                                    Rundenaufteilung berechnen
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="flex-end"
                            spacing={2}
                        >
                            <Grid item xs={12}>
                                {roundLimitations.map((roundLimit, index) => {
                                    return (
                                        <div>
                                            <Typography
                                                id="discrete-slider"
                                                gutterBottom
                                            >
                                                {this.renderSwitch(index)}
                                            </Typography>
                                            <div className={classes.row}>
                                                <Slider
                                                    disabled={index == 0}
                                                    defaultValue={
                                                        roundLimit.limit
                                                    }
                                                    aria-labelledby="discrete-slider-small-steps"
                                                    step={1}
                                                    min={0}
                                                    max={suggestedNumber}
                                                    onChangeCommitted={(
                                                        e,
                                                        value
                                                    ) => {
                                                        let localRoundLimitations =
                                                            roundLimitations;
                                                        localRoundLimitations[
                                                            index
                                                        ].limit =
                                                            parseInt(value);
                                                        this.setState({
                                                            roundLimitations:
                                                                localRoundLimitations,
                                                        });
                                                    }}
                                                    valueLabelDisplay="auto"
                                                    marks={[
                                                        index > 0 && {
                                                            value: roundLimitations[
                                                                index - 1
                                                            ].limit,
                                                            label: "max",
                                                        },
                                                    ]}
                                                />
                                                <Tooltip title="Entfernen">
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
                            </Grid>
                            <Tooltip title="Weitere Runde">
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
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                this.props.handleClose();
                            }}
                            color="secondary"
                            variant="contained"
                        >
                            abbrechen
                        </Button>
                        <Button
                            disabled={this.state.disabled}
                            onClick={() => {
                                this.atomicUpsertRoundSet();
                                this.props.handleClose();
                            }}
                            color="primary"
                            variant="contained"
                        >
                            speichern
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
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
    withLocalize(withProps(RoundSetDialog))
);
