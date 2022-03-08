//HOC and util
import React from "react";
import { PropTypes } from "prop-types";
import withStyles from "@material-ui/core/es/styles/withStyles";

import { isRxCollection, isRxDatabase, isRxDocument } from "rxdb";

import withProps from "../../components/HOC";
import { getCollection } from "../../Database";

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

            getCollection("scoringrule").then(async (collection) => {
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
            });

            getCollection("user").then(async (collection) => {
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
            });

            getCollection("competition").then(async (collection) => {
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
            });
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
        getCollection("round").then(async (collection) => {
            collection.atomicUpsert(object);
        });
    }

    render() {
        const { classes } = this.props;
        const { localRound } = this.state;

        return localRound ? (
            <div>
                <Dialog
                    open={this.props.open}
                    onClose={() => this.handleClose()}
                    aria-labelledby='form-dialog-title'
                    scroll='body'
                >
                    <DialogTitle id='form-dialog-title'>
                        Runde anlegen / bearbeiten
                    </DialogTitle>
                    <DialogContent dividers>
                        <TextField
                            margin='dense'
                            id='name'
                            name='name'
                            defaultValue={localRound.roundName}
                            required={true}
                            onChange={(e) => {
                                let newValue = e.target.value;
                                this.setState((prevState) => {
                                    let localRound = Object.assign(
                                        {},
                                        prevState.localRound
                                    ); // creating copy of state variable
                                    localRound.roundName = newValue; // update the name property, assign a new value
                                    return { localRound }; // return new object
                                });
                            }}
                            helperText='Name der Runde'
                            label='Name'
                            type='text'
                            fullWidth
                            className={classes.inputContent}
                        />
                        <div className={classes.inputContent}>
                            <InputLabel
                                required={true}
                                shrink={true}
                                className={classes.inputContent}
                                htmlFor='role-select'
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
                                    this.state.evaluations.map((evaluation) => {
                                        return (
                                            <MenuItem value={evaluation.id}>
                                                {evaluation.name}
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
                                htmlFor='role-select'
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
                                        localRound.status = e.target.value; // update the name property, assign a new value
                                        return { localRound }; // return new object
                                    });
                                }}
                            >
                                <MenuItem value='blocked'>Fehlerhaft</MenuItem>
                                <MenuItem value='waiting'>Vorbereitet</MenuItem>
                                <MenuItem value='running'>Laufend</MenuItem>
                                <MenuItem value='done'>Abgeschlossen</MenuItem>
                            </Select>
                        </div>
                        {/* Section to select users as judges */}
                        <div className={classes.inputContent}>
                            <InputLabel
                                required={true}
                                shrink={true}
                                className={classes.inputContent}
                                htmlFor='role-select'
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
                                                            ] = e.target.value; // update the name property, assign a new value
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
                                                            return (
                                                                <MenuItem
                                                                    value={
                                                                        user.id
                                                                    }
                                                                >
                                                                    {user.name}
                                                                </MenuItem>
                                                            );
                                                        }
                                                    )}
                                            </Select>
                                        );
                                    }
                                )}
                        </div>
                        <Tooltip title='Weiterer Wertungsrichter'>
                            <IconButton
                                onClick={() => {
                                    let localRoundCopy = JSON.parse(
                                        JSON.stringify(localRound)
                                    );
                                    localRoundCopy.judgeIds
                                        ? localRoundCopy.judgeIds.push("")
                                        : (localRoundCopy.judgeIds = [""]);
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
                                htmlFor='role-select'
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
                                                            ] = e.target.value; // update the name property, assign a new value
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
                                                            return (
                                                                <MenuItem
                                                                    value={
                                                                        user.id
                                                                    }
                                                                >
                                                                    {user.name}
                                                                </MenuItem>
                                                            );
                                                        }
                                                    )}
                                            </Select>
                                        );
                                    }
                                )}
                        </div>
                        <Tooltip title='Weiterer Observer'>
                            <IconButton
                                onClick={() => {
                                    let localRoundCopy = JSON.parse(
                                        JSON.stringify(localRound)
                                    );
                                    localRoundCopy.observerIds
                                        ? localRoundCopy.observerIds.push("")
                                        : (localRoundCopy.observerIds = [""]);
                                    this.setState({
                                        localRound: localRoundCopy,
                                    });
                                }}
                            >
                                <Add />
                            </IconButton>
                        </Tooltip>
                        <Divider />
                        {/* Section to select teams inside rounds*/}
                        <div className={classes.inputContent}>
                            <InputLabel
                                required={true}
                                shrink={true}
                                className={classes.inputContent}
                                htmlFor='role-select'
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
                                                            (prevState) => {
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
                                                    {this.state.competition &&
                                                        this.state.competition.map(
                                                            (competition) => {
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
                                                            (prevState) => {
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
                                                    <MenuItem value='blocked'>
                                                        Fehlerhaft
                                                    </MenuItem>
                                                    <MenuItem value='waiting'>
                                                        Vorbereitet
                                                    </MenuItem>
                                                    <MenuItem value='running'>
                                                        Laufend
                                                    </MenuItem>
                                                    <MenuItem value='done'>
                                                        Abgeschlossen
                                                    </MenuItem>
                                                </Select>
                                            </div>
                                        );
                                    }
                                )}
                        </div>
                        <Tooltip title='Weiterere Teilrunde'>
                            <IconButton
                                onClick={() => {
                                    let localRoundCopy = JSON.parse(
                                        JSON.stringify(localRound)
                                    );
                                    localRoundCopy.subrounds
                                        ? localRoundCopy.subrounds.push({
                                              participants: [""],
                                              status: "blocked",
                                          })
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
                            onClick={async () => {
                                this.upsertRound(localRound).then(
                                    this.props.handleClose()
                                );
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

export default withStyles(styles, { withTheme: true })(withProps(RoundDialog));
