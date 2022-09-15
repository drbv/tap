import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import {
    LinearProgress,
    Paper,
    Button,
    Tooltip,
    IconButton,
    Checkbox,
} from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";
import * as Database from "../../Database";
import ScoringruleDialog from "./ScoringruleDialog";
import withStyles from "@material-ui/core/es/styles/withStyles";

const styles = (theme) => ({
    root: {
        flexGrow: 1,
        padding: 30,
    },
    table: {
        margin: "11px",
        marginBottom: "80px",
    },
    newScoringruleField: {
        margin: "11px",
    },
    newScoringruleButton: {
        margin: 10,
    },
});

class Scoringrule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newScoringruleOpen: false,
            evaluationId: null,
            Scoringrule: null,
        };

        this.subs = [];
    }

    async componentDidMount() {
        Database.getCollection("scoring_rule", this.props.competitionId).then(
            (collection) => {
                const sub = collection.find().$.subscribe((Scoringrule) => {
                    if (!Scoringrule) {
                        return;
                    }
                    console.log("reload Scoringrule-list ");
                    console.dir(Scoringrule);
                    this.setState({
                        Scoringrule,
                    });
                });
                this.subs.push(sub);
            }
        );
    }

    componentWillUnmount() {
        // Unsubscribe from all subscriptions
        this.subs.forEach((sub) => sub.unsubscribe());
    }

    async deleteScoringrule(id) {
        await this.state.db.scoring_rule
            .findOne({
                selector: {
                    id: id,
                },
            })
            .remove();
    }

    render() {
        const { classes } = this.props;
        const { Scoringrule, newScoringruleOpen, evaluationId } = this.state;

        return (
            <div>
                <Paper className={classes.newScoringruleField}>
                    <Button
                        className={classes.newScoringruleButton}
                        color="inherit"
                        variant="outlined"
                        onClick={() => {
                            this.setState({ newScoringruleOpen: true });
                        }}
                    >
                        Wertungsbogen erstellen
                    </Button>
                </Paper>
                <ScoringruleDialog
                    open={newScoringruleOpen}
                    evaluationId={evaluationId}
                    handleClose={() =>
                        this.setState({
                            newScoringruleOpen: false,
                            evaluationId: null,
                        })
                    }
                />
                {Scoringrule != null ? (
                    <MUIDataTable
                        className={classes.table}
                        data={Scoringrule}
                        columns={[
                            {
                                name: "id",
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: "league",
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                            },
                            {
                                name: "rounds",
                                options: {
                                    filter: false,
                                    sort: true,
                                    customBodyRender: (
                                        value,
                                        tableMeta,
                                        updateValue
                                    ) => {
                                        if (tableMeta.rowData != null) {
                                            return (
                                                <div>
                                                    <Checkbox
                                                        defaultChecked={
                                                            value?.qualifying
                                                        }
                                                    />
                                                    <Checkbox
                                                        defaultChecked={
                                                            value?.intermediate
                                                        }
                                                    />
                                                    <Checkbox
                                                        defaultChecked={
                                                            value?.semifinals
                                                        }
                                                    />
                                                    <Checkbox
                                                        defaultChecked={
                                                            value?.finals
                                                        }
                                                    />
                                                </div>
                                            );
                                        }
                                    },
                                },
                            },
                            {
                                name: "categories",
                                options: {
                                    display: "excluded",
                                    filter: false,
                                },
                            },
                            {
                                name: "deduction",
                                options: {
                                    display: "excluded",
                                    filter: false,
                                },
                            },
                            {
                                name: "bonus",
                                options: {
                                    display: "excluded",
                                    filter: false,
                                },
                            },
                            {
                                name: "aktionen",
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
                                                    <Tooltip title="Bearbeiten">
                                                        <span>
                                                            <IconButton
                                                                onClick={() => {
                                                                    this.setState(
                                                                        {
                                                                            newScoringruleOpen:
                                                                                !newScoringruleOpen,
                                                                            evaluationId:
                                                                                tableMeta
                                                                                    .rowData[0],
                                                                        }
                                                                    );
                                                                }}
                                                            >
                                                                <Edit />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                    <Tooltip title="Entfernen">
                                                        <span>
                                                            <IconButton
                                                                onClick={() => {
                                                                    this.deleteScoringrule(
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
                    <div />
                )}
            </div>
        );
    }
}

// Specifies the default values for props:
Scoringrule.defaultProps = {
    routes: {
        routes: [
            {
                name: "default",
                path: "/Scoringrule",
                exact: true,
                component: <LinearProgress />,
                admin: false,
                icon: null,
                hide: true,
            },
        ],
    },
};

export default withStyles(styles, { withTheme: true })(Scoringrule);
