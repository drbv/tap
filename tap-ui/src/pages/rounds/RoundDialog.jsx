//HOC and util
import React from "react";
import { PropTypes } from "prop-types";
import withStyles from "@material-ui/core/es/styles/withStyles";

import { withLocalize } from "react-localize-redux";

import { isRxCollection, isRxDatabase, isRxDocument } from "rxdb";

import withProps from "../../components/HOC";
import { getCollection } from "../../Database";
import roundTranslation from "../../translations/rounds.json";
import athleteTranslation from "../../translations/athletes.json";

//components and libraries
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    IconButton,
    FormHelperText,
    FormControl,
    CircularProgress,
    Tooltip,
} from "@material-ui/core";

import { BlurOn, Delete, Add } from "@material-ui/icons";
import { Divider } from "@material-ui/core";

const styles = (theme) => ({
    inputContent: {
        marginTop: 20,
    },
    flexboxContainer: {
        display: "flex",
        "align-items": "center",
    },
    row: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
});

class RoundDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            localRound: null,
            evaluations: null,
            users: null,
        };
        this.subs = [];
        this.props.addTranslation(roundTranslation);
        this.props.addTranslation(athleteTranslation);
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.open !== this.props.open) {
            if (this.props.roundToEdit) {
                this.setState({ localRound: this.props.roundToEdit });
            } else {
                this.setState({
                    localRound: {
                        roundId: Date.now().toString(),
                    },
                });
            }

            getCollection("scoring_rule", this.props.competitionId).then(
                async (collection) => {
                    const sub = await collection
                        .find()
                        .$.subscribe((evaluations) => {
                            if (!evaluations) {
                                return;
                            }
                            console.log("reload evaluations-list ");
                            console.dir(evaluations);
                            this.setState({
                                evaluations,
                            });
                        });
                    this.subs.push(sub);
                }
            );

            getCollection("user", this.props.competitionId).then(
                async (collection) => {
                    const sub = await collection.find().$.subscribe((users) => {
                        if (!users) {
                            return;
                        }
                        console.log("reload users-list ");
                        console.dir(users);
                        this.setState({
                            users,
                        });
                    });
                    this.subs.push(sub);
                }
            );

            getCollection("competition", this.props.competitionId).then(
                async (collection) => {
                    const sub = await collection
                        .find()
                        .$.subscribe((competition) => {
                            if (!competition) {
                                return;
                            }
                            console.log("reload competition-list ");
                            console.dir(competition);
                            this.setState({
                                competition,
                            });
                        });
                    this.subs.push(sub);
                }
            );
        }
    }

    componentWillUnmount() {
        // Unsubscribe from all subscriptions
        this.subs.forEach((sub) => sub.unsubscribe());
    }

    async handleClose() {
        // Unsubscribe from all subscriptions
        this.subs.forEach((sub) => sub.unsubscribe());
        this.props.handleClose();
    }

    async upsertRound(object) {
        getCollection("round", this.props.competitionId).then(
            async (collection) => {
                collection.atomicUpsert(object);
            }
        );
    }

    render() {
        const { classes, translate } = this.props;
        const { localRound } = this.state;

        return localRound ? (
            <div>
                <Dialog
                    open={this.props.open}
                    onClose={() => this.handleClose()}
                    aria-labelledby="form-dialog-title"
                    scroll="body"
                >
                    <DialogTitle id="form-dialog-title">
                        Runde anlegen / bearbeiten
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={4}>
                            <Grid item xs={4}>
                                <div className={classes.inputContent}>
                                    <InputLabel
                                        required={true}
                                        shrink={true}
                                        className={classes.inputContent}
                                        htmlFor="role-select"
                                    >
                                        Rundentyp
                                    </InputLabel>
                                    <Select
                                        fullWidth
                                        inputProps={{
                                            name: "roundType",
                                            id: "roundType-select",
                                        }}
                                        value={localRound.roundType}
                                        onChange={(e) => {
                                            this.setState((prevState) => {
                                                let localRound = Object.assign(
                                                    {},
                                                    prevState.localRound
                                                ); // creating copy of state variable
                                                localRound.roundType =
                                                    e.target.value; // update the name property, assign a new value
                                                return { localRound }; // return new object
                                            });
                                        }}
                                    >
                                        <MenuItem value="qualifying">
                                            {translate(
                                                "round.roundTypes.qualifying"
                                            )}
                                        </MenuItem>
                                        <MenuItem value="intermediate">
                                            {translate(
                                                "round.roundTypes.intermediate"
                                            )}
                                        </MenuItem>
                                        <MenuItem value="hope">
                                            {translate("round.roundTypes.hope")}
                                        </MenuItem>
                                        <MenuItem value="finals">
                                            {translate(
                                                "round.roundTypes.finals"
                                            )}
                                        </MenuItem>
                                    </Select>
                                </div>
                                <div className={classes.inputContent}>
                                    <InputLabel
                                        required={true}
                                        shrink={true}
                                        className={classes.inputContent}
                                        htmlFor="role-select"
                                    >
                                        Tanzklasse
                                    </InputLabel>
                                    <Select
                                        fullWidth
                                        inputProps={{
                                            name: "league",
                                            id: "league-select",
                                        }}
                                        value={localRound.league}
                                        onChange={(e) => {
                                            alert(e.target.value);
                                            this.setState((prevState) => {
                                                let localRound = Object.assign(
                                                    {},
                                                    prevState.localRound
                                                ); // creating copy of state variable
                                                localRound.league =
                                                    e.target.value; // update the name property, assign a new value
                                                return { localRound }; // return new object
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
                                            name: "evaluation",
                                            id: "evaluation-select",
                                        }}
                                        value={localRound.evaluationTemplateId}
                                        onChange={(e) => {
                                            this.setState((prevState) => {
                                                let localRound = Object.assign(
                                                    {},
                                                    prevState.localRound
                                                ); // creating copy of state variable
                                                localRound.evaluationTemplateId =
                                                    e.target.value; // update the name property, assign a new value
                                                return { localRound }; // return new object
                                            });
                                        }}
                                    >
                                        {this.state.evaluations &&
                                            this.state.evaluations.map(
                                                (evaluation) => {
                                                    return (
                                                        <MenuItem
                                                            value={
                                                                evaluation.id
                                                            }
                                                        >
                                                            {evaluation.league}
                                                        </MenuItem>
                                                    );
                                                }
                                            )}
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
                                            name: "status",
                                            id: "status-select",
                                        }}
                                        value={localRound.status}
                                        onChange={(e) => {
                                            this.setState((prevState) => {
                                                let localRound = Object.assign(
                                                    {},
                                                    prevState.localRound
                                                ); // creating copy of state variable
                                                localRound.status =
                                                    e.target.value; // update the name property, assign a new value
                                                return { localRound }; // return new object
                                            });
                                        }}
                                    >
                                        <MenuItem value="blocked">
                                            Fehlerhaft
                                        </MenuItem>
                                        <MenuItem value="waiting">
                                            Vorbereitet
                                        </MenuItem>
                                        <MenuItem value="running">
                                            Laufend
                                        </MenuItem>
                                        <MenuItem value="done">
                                            Abgeschlossen
                                        </MenuItem>
                                    </Select>
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                {/* Section to select users as judges */}
                                <div className={classes.inputContent}>
                                    <InputLabel
                                        required={true}
                                        shrink={true}
                                        className={classes.inputContent}
                                        htmlFor="role-select"
                                    >
                                        Wertungsrichter
                                    </InputLabel>
                                    {localRound.judgeIds &&
                                        localRound.judgeIds.map(
                                            (singleJudgeId, index) => {
                                                return (
                                                    <Select
                                                        fullWidth
                                                        inputProps={{
                                                            name: "judge",
                                                            id: "judge-select",
                                                        }}
                                                        value={singleJudgeId}
                                                        onChange={(e) => {
                                                            this.setState(
                                                                (prevState) => {
                                                                    let localRound =
                                                                        Object.assign(
                                                                            {},
                                                                            prevState.localRound
                                                                        ); // creating copy of state variable
                                                                    localRound.judgeIds[
                                                                        index
                                                                    ] =
                                                                        e.target.value; // update the name property, assign a new value
                                                                    return {
                                                                        localRound,
                                                                    }; // return new object
                                                                }
                                                            );
                                                        }}
                                                    >
                                                        {this.state.users &&
                                                            this.state.users.map(
                                                                (user) => {
                                                                    return (!localRound.observerIds ||
                                                                        !localRound.observerIds.includes(
                                                                            user
                                                                        )) &&
                                                                        (!localRound.acroJudgeIds ||
                                                                            !localRound.acroJudgeIds.includes(
                                                                                user
                                                                            )) &&
                                                                        (!localRound.judgeIds ||
                                                                            !localRound.judgeIds.includes(
                                                                                user
                                                                            )) ? (
                                                                        <MenuItem
                                                                            value={
                                                                                user.id
                                                                            }
                                                                        >
                                                                            {
                                                                                user.name
                                                                            }
                                                                        </MenuItem>
                                                                    ) : null;
                                                                }
                                                            )}
                                                    </Select>
                                                );
                                            }
                                        )}
                                </div>
                                <Tooltip title="Weiterer Wertungsrichter">
                                    <IconButton
                                        onClick={() => {
                                            let localRoundCopy = JSON.parse(
                                                JSON.stringify(localRound)
                                            );
                                            localRoundCopy.judgeIds
                                                ? localRoundCopy.judgeIds.push(
                                                      ""
                                                  )
                                                : (localRoundCopy.judgeIds = [
                                                      "",
                                                  ]);
                                            this.setState({
                                                localRound: localRoundCopy,
                                            });
                                        }}
                                    >
                                        <Add />
                                    </IconButton>
                                </Tooltip>
                                <Divider />
                                {/* Section to select users as acroJudge */}
                                <div className={classes.inputContent}>
                                    <InputLabel
                                        required={true}
                                        shrink={true}
                                        className={classes.inputContent}
                                        htmlFor="role-select"
                                    >
                                        Akrobatik-Wertungsrichter
                                    </InputLabel>
                                    {localRound.acroJudgeIds &&
                                        localRound.acroJudgeIds.map(
                                            (singleJudgeId, index) => {
                                                return (
                                                    <Select
                                                        fullWidth
                                                        inputProps={{
                                                            name: "judge",
                                                            id: "judge-select",
                                                        }}
                                                        value={singleJudgeId}
                                                        onChange={(e) => {
                                                            this.setState(
                                                                (prevState) => {
                                                                    let localRound =
                                                                        Object.assign(
                                                                            {},
                                                                            prevState.localRound
                                                                        ); // creating copy of state variable
                                                                    localRound.acroJudgeIds[
                                                                        index
                                                                    ] =
                                                                        e.target.value; // update the name property, assign a new value
                                                                    return {
                                                                        localRound,
                                                                    }; // return new object
                                                                }
                                                            );
                                                        }}
                                                    >
                                                        {this.state.users &&
                                                            this.state.users.map(
                                                                (user) => {
                                                                    return (!localRound.observerIds ||
                                                                        !localRound.observerIds.includes(
                                                                            user
                                                                        )) &&
                                                                        (!localRound.acroJudgeIds ||
                                                                            !localRound.acroJudgeIds.includes(
                                                                                user
                                                                            )) &&
                                                                        (!localRound.judgeIds ||
                                                                            !localRound.judgeIds.includes(
                                                                                user
                                                                            )) ? (
                                                                        <MenuItem
                                                                            value={
                                                                                user.id
                                                                            }
                                                                        >
                                                                            {
                                                                                user.name
                                                                            }
                                                                        </MenuItem>
                                                                    ) : null;
                                                                }
                                                            )}
                                                    </Select>
                                                );
                                            }
                                        )}
                                </div>
                                <Tooltip title="Weiterer Akrobatik-Wertungsrichter">
                                    <IconButton
                                        onClick={() => {
                                            let localRoundCopy = JSON.parse(
                                                JSON.stringify(localRound)
                                            );
                                            localRoundCopy.acroJudgeIds
                                                ? localRoundCopy.acroJudgeIds.push(
                                                      ""
                                                  )
                                                : (localRoundCopy.acroJudgeIds =
                                                      [""]);
                                            this.setState({
                                                localRound: localRoundCopy,
                                            });
                                        }}
                                    >
                                        <Add />
                                    </IconButton>
                                </Tooltip>
                                <Divider />
                                {/* Section to select users as observers */}
                                <div className={classes.inputContent}>
                                    <InputLabel
                                        required={true}
                                        shrink={true}
                                        className={classes.inputContent}
                                        htmlFor="role-select"
                                    >
                                        Observer
                                    </InputLabel>
                                    {localRound.observerIds &&
                                        localRound.observerIds.map(
                                            (singleObserverId, index) => {
                                                return (
                                                    <Select
                                                        fullWidth
                                                        inputProps={{
                                                            name: "observer",
                                                            id: "observer-select",
                                                        }}
                                                        value={singleObserverId}
                                                        onChange={(e) => {
                                                            this.setState(
                                                                (prevState) => {
                                                                    let localRound =
                                                                        Object.assign(
                                                                            {},
                                                                            prevState.localRound
                                                                        ); // creating copy of state variable
                                                                    localRound.observerIds[
                                                                        index
                                                                    ] =
                                                                        e.target.value; // update the name property, assign a new value
                                                                    return {
                                                                        localRound,
                                                                    }; // return new object
                                                                }
                                                            );
                                                        }}
                                                    >
                                                        {this.state.users &&
                                                            this.state.users.map(
                                                                (user) => {
                                                                    return (!localRound.observerIds ||
                                                                        !localRound.observerIds.includes(
                                                                            user
                                                                        )) &&
                                                                        (!localRound.acroJudgeIds ||
                                                                            !localRound.acroJudgeIds.includes(
                                                                                user
                                                                            )) &&
                                                                        (!localRound.judgeIds ||
                                                                            !localRound.judgeIds.includes(
                                                                                user
                                                                            )) ? (
                                                                        <MenuItem
                                                                            value={
                                                                                user.id
                                                                            }
                                                                        >
                                                                            {
                                                                                user.name
                                                                            }
                                                                        </MenuItem>
                                                                    ) : null;
                                                                }
                                                            )}
                                                    </Select>
                                                );
                                            }
                                        )}
                                </div>
                                <Tooltip title="Weiterer Observer">
                                    <IconButton
                                        onClick={() => {
                                            let localRoundCopy = JSON.parse(
                                                JSON.stringify(localRound)
                                            );
                                            localRoundCopy.observerIds
                                                ? localRoundCopy.observerIds.push(
                                                      ""
                                                  )
                                                : (localRoundCopy.observerIds =
                                                      [""]);
                                            this.setState({
                                                localRound: localRoundCopy,
                                            });
                                        }}
                                    >
                                        <Add />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={4}>
                                {/* Section to select teams inside rounds*/}
                                <div className={classes.inputContent}>
                                    <InputLabel
                                        required={true}
                                        shrink={true}
                                        className={classes.inputContent}
                                        htmlFor="role-select"
                                    >
                                        Tanzpaare
                                    </InputLabel>
                                    {localRound.subrounds &&
                                        localRound.subrounds.map(
                                            (singleSubround, index) => {
                                                return (
                                                    <div>
                                                        <Select
                                                            fullWidth
                                                            inputProps={{
                                                                name: "participant",
                                                                id: "participant-select",
                                                            }}
                                                            value={
                                                                singleSubround.participants &&
                                                                singleSubround
                                                                    .participants[0]
                                                            }
                                                            onChange={(e) => {
                                                                this.setState(
                                                                    (
                                                                        prevState
                                                                    ) => {
                                                                        let localRound =
                                                                            JSON.parse(
                                                                                JSON.stringify(
                                                                                    this
                                                                                        .state
                                                                                        .localRound
                                                                                )
                                                                            ); // creating copy of state variable
                                                                        localRound.subrounds[
                                                                            index
                                                                        ].participants[0] =
                                                                            e.target.value; // update the name property, assign a new value
                                                                        return {
                                                                            localRound,
                                                                        }; // return new object
                                                                    }
                                                                );
                                                            }}
                                                        >
                                                            {this.state
                                                                .competition &&
                                                                this.state.competition.map(
                                                                    (
                                                                        competition
                                                                    ) => {
                                                                        return (
                                                                            <MenuItem
                                                                                value={
                                                                                    competition.bookId
                                                                                }
                                                                            >
                                                                                {
                                                                                    competition.bookId
                                                                                }
                                                                            </MenuItem>
                                                                        );
                                                                    }
                                                                )}
                                                        </Select>
                                                        <Select
                                                            fullWidth
                                                            inputProps={{
                                                                name: "status",
                                                                id: "status-select",
                                                            }}
                                                            value={
                                                                singleSubround.status
                                                            }
                                                            onChange={(e) => {
                                                                this.setState(
                                                                    (
                                                                        prevState
                                                                    ) => {
                                                                        let localRound =
                                                                            JSON.parse(
                                                                                JSON.stringify(
                                                                                    this
                                                                                        .state
                                                                                        .localRound
                                                                                )
                                                                            );
                                                                        // creating copy of state variable
                                                                        localRound.subrounds[
                                                                            index
                                                                        ].status =
                                                                            e.target.value; // update the name property, assign a new value
                                                                        return {
                                                                            localRound,
                                                                        }; // return new object
                                                                    }
                                                                );
                                                            }}
                                                        >
                                                            <MenuItem value="blocked">
                                                                Fehlerhaft
                                                            </MenuItem>
                                                            <MenuItem value="waiting">
                                                                Vorbereitet
                                                            </MenuItem>
                                                            <MenuItem value="running">
                                                                Laufend
                                                            </MenuItem>
                                                            <MenuItem value="done">
                                                                Abgeschlossen
                                                            </MenuItem>
                                                        </Select>
                                                    </div>
                                                );
                                            }
                                        )}
                                </div>
                                <Tooltip title="Weiterere Teilrunde">
                                    <IconButton
                                        onClick={() => {
                                            let localRoundCopy = JSON.parse(
                                                JSON.stringify(localRound)
                                            );
                                            localRoundCopy.subrounds
                                                ? localRoundCopy.subrounds.push(
                                                      {
                                                          participants: [""],
                                                          status: "blocked",
                                                      }
                                                  )
                                                : (localRoundCopy.subrounds = [
                                                      {
                                                          participants: [""],
                                                          status: "blocked",
                                                      },
                                                  ]);
                                            this.setState({
                                                localRound: localRoundCopy,
                                            });
                                        }}
                                    >
                                        <Add />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
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
                            onClick={async () => {
                                this.upsertRound(localRound).then(
                                    this.props.handleClose()
                                );
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
            ""
        );
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
};

export default withStyles(styles, { withTheme: true })(
    withLocalize(withProps(RoundDialog))
);
