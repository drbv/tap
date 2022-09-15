//HOC and util
import React from "react";
import { PropTypes } from "prop-types";
import withStyles from "@material-ui/core/es/styles/withStyles";

import { withLocalize } from "react-localize-redux";

import { isRxCollection, isRxDatabase, isRxDocument } from "rxdb";

import withProps from "../../components/HOC";
import { getCollection } from "../../Database";
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
    Checkbox,
    Grid,
} from "@material-ui/core";
import { Delete, Add } from "@material-ui/icons";
import { Tooltip } from "@material-ui/core";

const styles = (theme) => ({
    header: {
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
        alignItems: "flex-end",
        justifyContent: "flex-start",
    },
    flexboxContainer: {
        display: "flex",
        "align-items": "center",
    },
});

class ScoringruleDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            localScoringrule: null,
            numberCouples: null,
            suggestedNumber: null,
        };
        this.subs = [];

        this.props.addTranslation(athleteTranslation);
    }

    async componentWillUnmount() {
        this.subs.forEach((sub) => sub.unsubscribe());
    }

    async componentDidUpdate(prevProps, prevState) {
        if (
            prevProps.open !== this.props.open ||
            prevProps.evaluationId !== this.props.evaluationId
        ) {
            if (this.props.evaluationId) {
                this.loadScoringrule(this.props.evaluationId);
            } else {
                this.setState({
                    localScoringrule: {
                        id: Date.now().toString(),
                        rounds: {
                            qualifying: false,
                            intermediate: false,
                            semifinals: false,
                            finals: false,
                        },
                        acrobatic: true,
                    },
                });
            }
        }
    }

    async loadScoringrule(id) {
        getCollection("scoring_rule", this.props.competitionId).then(
            async (collection) => {
                const localScoringrule = await collection.findOne(id).exec();
                this.setState({
                    localScoringrule: localScoringrule.toJSON(),
                });
            }
        );
    }

    async atomicUpsertScoringrule(localScoringrule) {
        getCollection("scoring_rule", this.props.competitionId).then(
            async (collection) => {
                await collection.upsert(localScoringrule);
            }
        );
    }

    render() {
        const { classes, translate } = this.props;
        const { localScoringrule } = this.state;

        return localScoringrule ? (
            <div>
                <Dialog
                    open={this.props.open}
                    onClose={() => this.props.handleClose()}
                    aria-labelledby="form-dialog-title"
                    scroll="body"
                >
                    <DialogTitle id="form-dialog-title">
                        Wertungsbogen erstellen / bearbeiten
                    </DialogTitle>
                    <DialogContent dividers>
                        <div className={classes.inputContent}>
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
                                    value={localScoringrule.league}
                                    onChange={(e) => {
                                        this.setState((prevState) => {
                                            let localScoringrule =
                                                Object.assign(
                                                    {},
                                                    prevState.localScoringrule
                                                ); // creating copy of state variable
                                            localScoringrule.league =
                                                e.target.value; // update the name property, assign a new value
                                            return { localScoringrule }; // return new object
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
                                                    "athlete.leagues." + value
                                                )}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </div>
                            <Divider className={classes.header} />
                            <Typography className={classes.header}>
                                Runden
                            </Typography>
                            <div className={classes.inputContent}>
                                <Grid container spacing={2} direction="row">
                                    <Grid container xs={3}>
                                        <Typography>Vorrunde:</Typography>
                                        <Checkbox />
                                    </Grid>
                                    <Grid container xs={3}>
                                        <Typography>Zwischenrunde:</Typography>
                                        <Checkbox />
                                    </Grid>
                                    <Grid container xs={3}>
                                        <Typography>Hoffnungsrunde:</Typography>
                                        <Checkbox />
                                    </Grid>
                                    <Grid container xs={3}>
                                        <Typography>Finalrunde:</Typography>
                                        <Checkbox />
                                    </Grid>
                                    <Grid container xs={3}>
                                        <Typography>Akrobatik:</Typography>
                                        <Checkbox />
                                    </Grid>
                                </Grid>
                            </div>
                            <Divider className={classes.header} />
                            <Typography className={classes.header}>
                                Kategorien
                            </Typography>
                            {localScoringrule?.categories?.general?.map(
                                (category, index) => {
                                    return (
                                        <div className={classes.row}>
                                            <TextField
                                                margin="dense"
                                                id="name"
                                                name="name"
                                                style={{ width: "1000px" }}
                                                Title
                                                value={category.name}
                                                required={true}
                                                onChange={(e) => {
                                                    let localScoringruleCopy =
                                                        JSON.parse(
                                                            JSON.stringify(
                                                                localScoringrule
                                                            )
                                                        );
                                                    localScoringruleCopy.categories.general[
                                                        index
                                                    ].name = e.target.value;
                                                    this.setState({
                                                        localScoringrule:
                                                            localScoringruleCopy,
                                                    });
                                                }}
                                                label="Kategorie"
                                                type="text"
                                                fullWidth
                                                className={classes.inputContent}
                                            />
                                            <TextField
                                                margin="dense"
                                                id="min"
                                                name="min"
                                                Title
                                                value={category.min}
                                                required={true}
                                                onChange={(e) => {
                                                    let localScoringruleCopy =
                                                        Object.assign(
                                                            {},
                                                            localScoringrule
                                                        );
                                                    localScoringruleCopy.categories.general[
                                                        index
                                                    ].min = parseFloat(
                                                        e.target.value
                                                    );
                                                    this.setState({
                                                        localScoringrule:
                                                            localScoringruleCopy,
                                                    });
                                                }}
                                                label="Min"
                                                type="number"
                                                fullWidth
                                                className={classes.inputContent}
                                            />
                                            <TextField
                                                margin="dense"
                                                id="max"
                                                name="max"
                                                Title
                                                value={category.max}
                                                required={true}
                                                onChange={(e) => {
                                                    let localScoringruleCopy =
                                                        Object.assign(
                                                            {},
                                                            localScoringrule
                                                        );
                                                    localScoringruleCopy.categories.general[
                                                        index
                                                    ].max = parseFloat(
                                                        e.target.value
                                                    );
                                                    this.setState({
                                                        localScoringrule:
                                                            localScoringruleCopy,
                                                    });
                                                }}
                                                label="Max"
                                                type="number"
                                                fullWidth
                                                className={classes.inputContent}
                                            />
                                            <TextField
                                                margin="dense"
                                                id="name"
                                                name="name"
                                                Title
                                                value={category.step}
                                                required={true}
                                                onChange={(e) => {
                                                    let localScoringruleCopy =
                                                        Object.assign(
                                                            {},
                                                            localScoringrule
                                                        );
                                                    localScoringruleCopy.categories.general[
                                                        index
                                                    ].step = parseFloat(
                                                        e.target.value
                                                    );
                                                    this.setState({
                                                        localScoringrule:
                                                            localScoringruleCopy,
                                                    });
                                                }}
                                                label="Abstufung in %"
                                                type="number"
                                                fullWidth
                                                className={classes.inputContent}
                                            />
                                            <Tooltip title="Entfernen">
                                                <IconButton
                                                    onClick={() => {
                                                        let localScoringruleCopy =
                                                            Object.assign(
                                                                {},
                                                                localScoringrule
                                                            );
                                                        localScoringruleCopy.categories.general.splice(
                                                            index,
                                                            1
                                                        );
                                                        this.setState({
                                                            localScoringrule:
                                                                localScoringruleCopy,
                                                        });
                                                    }}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    );
                                }
                            )}
                            <Tooltip title="Weitere Kategorie">
                                <IconButton
                                    onClick={() => {
                                        let localScoringruleCopy = JSON.parse(
                                            JSON.stringify(localScoringrule)
                                        );
                                        localScoringruleCopy.categories
                                            ? localScoringruleCopy.categories.general.push(
                                                  {
                                                      name: "",
                                                      min: 0,
                                                      max: 1,
                                                      step: 1,
                                                  }
                                              )
                                            : (localScoringruleCopy.categories.general =
                                                  [
                                                      {
                                                          name: "",
                                                          min: 0,
                                                          max: 1,
                                                          step: 1,
                                                      },
                                                  ]);
                                        this.setState({
                                            localScoringrule:
                                                localScoringruleCopy,
                                        });
                                    }}
                                >
                                    <Add />
                                </IconButton>
                            </Tooltip>
                            <Divider className={classes.header} />
                            <Typography className={classes.header}>
                                Abzüge / Boni
                            </Typography>
                            {localScoringrule.deduction?.acro?.map(
                                (bonus, index) => {
                                    return (
                                        <div className={classes.row}>
                                            <TextField
                                                margin="dense"
                                                id="name"
                                                name="name"
                                                style={{ width: "1000px" }}
                                                Title
                                                value={bonus.name}
                                                required={true}
                                                onChange={(e) => {
                                                    let localScoringruleCopy =
                                                        JSON.parse(
                                                            JSON.stringify(
                                                                localScoringrule
                                                            )
                                                        );
                                                    localScoringruleCopy.deduction.acro[
                                                        index
                                                    ].name = e.target.value;
                                                    this.setState({
                                                        localScoringrule:
                                                            localScoringruleCopy,
                                                    });
                                                }}
                                                label="Abzug / Bonus"
                                                type="text"
                                                fullWidth
                                                className={classes.inputContent}
                                            />
                                            <TextField
                                                margin="dense"
                                                id="value"
                                                name="value"
                                                Title
                                                value={bonus.value}
                                                required={true}
                                                onChange={(e) => {
                                                    let localScoringruleCopy =
                                                        JSON.parse(
                                                            JSON.stringify(
                                                                localScoringrule
                                                            )
                                                        );
                                                    localScoringruleCopy.deduction.acro[
                                                        index
                                                    ].value = parseFloat(
                                                        e.target.value
                                                    );
                                                    if (e.target.value < 0) {
                                                        localScoringruleCopy.deduction.acro[
                                                            index
                                                        ].color = "red";
                                                    } else {
                                                        localScoringruleCopy.deduction.acro[
                                                            index
                                                        ].color = "green";
                                                    }
                                                    this.setState({
                                                        localScoringrule:
                                                            localScoringruleCopy,
                                                    });
                                                }}
                                                label="Value"
                                                type="number"
                                                fullWidth
                                                className={classes.inputContent}
                                            />
                                            <TextField
                                                margin="dense"
                                                id="limit"
                                                name="limit"
                                                Title
                                                value={bonus.limit}
                                                required={true}
                                                onChange={(e) => {
                                                    let localScoringruleCopy =
                                                        JSON.parse(
                                                            JSON.stringify(
                                                                localScoringrule
                                                            )
                                                        );
                                                    localScoringruleCopy.deduction.acro[
                                                        index
                                                    ].limit = e.target.value;
                                                    this.setState({
                                                        localScoringrule:
                                                            localScoringruleCopy,
                                                    });
                                                }}
                                                label="Limit"
                                                type="number"
                                                fullWidth
                                                className={classes.inputContent}
                                            />
                                            <Tooltip title="Entfernen">
                                                <IconButton
                                                    onClick={() => {
                                                        let localScoringruleCopy =
                                                            JSON.parse(
                                                                JSON.stringify(
                                                                    localScoringrule
                                                                )
                                                            );
                                                        localScoringruleCopy.deduction.acro.splice(
                                                            index,
                                                            1
                                                        );
                                                        this.setState({
                                                            localScoringrule:
                                                                localScoringruleCopy,
                                                        });
                                                    }}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    );
                                }
                            )}
                            <Tooltip title="Abzug / Bonus hinzufügen">
                                <IconButton
                                    onClick={() => {
                                        let localScoringruleCopy = JSON.parse(
                                            JSON.stringify(localScoringrule)
                                        );
                                        localScoringruleCopy.deduction.acro
                                            ? localScoringruleCopy.deduction.acro.push(
                                                  {
                                                      name: "",
                                                      value: 0,
                                                      limit: 0,
                                                  }
                                              )
                                            : (localScoringruleCopy.deduction.acro =
                                                  [
                                                      {
                                                          name: "",
                                                          value: 0,
                                                          limit: 0,
                                                      },
                                                  ]);
                                        this.setState({
                                            localScoringrule:
                                                localScoringruleCopy,
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
                            color="secondary"
                            variant="contained"
                        >
                            abbrechen
                        </Button>
                        <Button
                            disabled={this.state.disabled}
                            onClick={() => {
                                this.atomicUpsertScoringrule(
                                    localScoringrule
                                ).then(this.props.handleClose());
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

ScoringruleDialog.propTypes = {
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
    withLocalize(withProps(ScoringruleDialog))
);
