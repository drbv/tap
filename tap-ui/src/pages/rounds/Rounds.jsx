import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Translate, withLocalize } from "react-localize-redux";

import MUIDataTable from "mui-datatables";
import {
    LinearProgress,
    Paper,
    Button,
    Tooltip,
    IconButton,
} from "@material-ui/core";
import withStyles from "@material-ui/core/es/styles/withStyles";
import { Edit, Delete, PeopleAlt } from "@material-ui/icons";
import { getCollection } from "../../Database";
import RoundSetDialog from "./RoundSetDialog";
import RoundDialog from "./RoundDialog";

import roundTranslation from "../../translations/rounds.json";
import athleteTranslation from "../../translations/athletes.json";

const styles = (theme) => ({
    root: {
        flexGrow: 1,
        padding: 30,
    },
    table: {
        margin: "11px",
        marginBottom: "80px",
    },
    newRoundField: {
        margin: "11px",
    },
    newRoundButton: {
        margin: 10,
    },
});

class Rounds extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newRoundSetOpen: false,
            roundSetToEdit: null,
            roundsets: null,
            newRoundOpen: false,
            rountToEdit: null,
            Rounds: null,
            subRoundsOpen: false,
            subRoundPropId: null,
        };

        this.subs = [];
        this.props.addTranslation(roundTranslation);
        this.props.addTranslation(athleteTranslation);
    }

    async componentDidMount() {
        await this.reloadObjects();
    }

    async reloadObjects() {
        // Unsubscribe from all subscriptions
        this.subs.forEach((sub) => sub.unsubscribe());

        getCollection("round").then(async (collection) => {
            const sub = await collection.find().$.subscribe((Rounds) => {
                if (!Rounds) {
                    return;
                }
                console.log("reload rounds-list ");
                console.dir(Rounds);
                this.setState({
                    Rounds,
                });
            });
            this.subs.push(sub);
        });
    }

    componentWillUnmount() {
        // Unsubscribe from all subscriptions
        this.subs.forEach((sub) => sub.unsubscribe());
    }

    render() {
        const { classes, translate } = this.props;
        const {
            Rounds,
            roundToEdit,
            newRoundSetOpen,
            newRoundOpen,
            subRoundsOpen,
            subRoundPropId,
        } = this.state;

        return (
            <div>
                <Paper className={classes.newRoundField}>
                    <Button
                        className={classes.newRoundButton}
                        color='inherit'
                        variant='outlined'
                        color='primary'
                        onClick={() => {
                            this.setState({ newRoundSetOpen: true });
                        }}
                    >
                        Rundenaufteilung erstellen
                    </Button>
                    <Button
                        className={classes.newRoundButton}
                        color='inherit'
                        variant='outlined'
                        color='primary'
                        onClick={() => {
                            this.setState({ newRoundOpen: true });
                        }}
                    >
                        Runde erstellen
                    </Button>
                </Paper>
                <RoundSetDialog
                    open={newRoundSetOpen}
                    handleClose={() =>
                        this.setState({
                            newRoundSetOpen: false,
                        })
                    }
                />
                <RoundDialog
                    open={newRoundOpen}
                    roundToEdit={roundToEdit}
                    handleClose={() => {
                        this.setState({ newRoundOpen: false });
                        this.reloadObjects();
                    }}
                />
                {Rounds != null ? (
                    <MUIDataTable
                        className={classes.table}
                        data={Rounds}
                        columns={[
                            {
                                name: "roundId",
                                options: {
                                    filter: false,
                                    display: "excluded",
                                },
                            },
                            {
                                name: "roundType",
                                label: translate("round.roundType"),
                                options: {
                                    filter: false,
                                    sort: true,
                                    customBodyRender: (value) => {
                                        return translate(
                                            "round.roundTypes." + value
                                        );
                                    },
                                },
                            },
                            {
                                name: "league",
                                label: translate("athlete.league"),
                                options: {
                                    filter: false,
                                    sort: true,
                                    customBodyRender: (value) => {
                                        return translate(
                                            "athlete.leagues." + value
                                        );
                                    },
                                },
                            },
                            {
                                name: "subrounds",
                                options: {
                                    filter: false,
                                    sort: true,
                                    customBodyRender: (value) => {
                                        return JSON.stringify(value);
                                    },
                                },
                            },
                            {
                                name: "evaluationTemplateId",
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                            },
                            {
                                name: "acroTemplateId",
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                            },
                            {
                                name: "judgeIds",
                                options: {
                                    filter: false,
                                    display: "excluded",
                                    sort: true,
                                },
                            },
                            {
                                name: "acroJudgeIds",
                                options: {
                                    filter: false,
                                    display: "excluded",
                                    sort: true,
                                },
                            },
                            {
                                name: "observerIds",
                                options: {
                                    filter: false,
                                    display: "excluded",
                                    sort: true,
                                },
                            },
                            {
                                name: "status",
                                label: translate("round.status"),
                                options: {
                                    filter: false,
                                    sort: true,
                                    customBodyRender: (
                                        value,
                                        tableMeta,
                                        updateValue
                                    ) => {
                                        return translate(
                                            "round.stati." + value
                                        );
                                    },
                                },
                            },
                            {
                                name: "actions",
                                label: translate("round.actions"),
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
                                                    <Tooltip title='Bearbeiten'>
                                                        <span>
                                                            <IconButton
                                                                onClick={() => {
                                                                    this.setState(
                                                                        {
                                                                            newRoundOpen:
                                                                                !newRoundOpen,
                                                                            roundToEdit:
                                                                                {
                                                                                    roundId:
                                                                                        tableMeta
                                                                                            .rowData[0],
                                                                                    roundType:
                                                                                        tableMeta
                                                                                            .rowData[1],
                                                                                    league: tableMeta
                                                                                        .rowData[2],
                                                                                    subrounds:
                                                                                        tableMeta
                                                                                            .rowData[3],
                                                                                    evaluationTemplateId:
                                                                                        tableMeta
                                                                                            .rowData[4],
                                                                                    acroTemplateId:
                                                                                        tableMeta
                                                                                            .rowData[5],
                                                                                    judgeIds:
                                                                                        tableMeta
                                                                                            .rowData[6],
                                                                                    acroJudgeIds:
                                                                                        tableMeta
                                                                                            .rowData[7],
                                                                                    observerIds:
                                                                                        tableMeta
                                                                                            .rowData[8],
                                                                                    status: tableMeta
                                                                                        .rowData[9],
                                                                                },
                                                                        }
                                                                    );
                                                                }}
                                                            >
                                                                <Edit />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                    <Tooltip title='Entfernen'>
                                                        <span>
                                                            <IconButton
                                                                onClick={() => {
                                                                    this.deleteRound(
                                                                        tableMeta
                                                                            .rowData[0]
                                                                    );
                                                                }}
                                                            >
                                                                <Delete />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                </div>
                                            );
                                        }
                                    },
                                },
                            },
                        ]}
                        options={{
                            filter: false,
                            print: false,
                            selectableRows: "none",
                            rowsPerPageOptions: [10, 50, 100, 250],
                        }}
                    />
                ) : (
                    <LinearProgress />
                )}
            </div>
        );
    }
}

// Specifies the default values for props:
Rounds.defaultProps = {
    routes: {
        routes: [
            {
                name: "default",
                path: "/rounds",
                exact: true,
                component: <LinearProgress />,
                admin: false,
                icon: null,
                hide: true,
            },
        ],
    },
};

export default withStyles(styles, { withTheme: true })(
    withLocalize(withRouter(Rounds))
);
