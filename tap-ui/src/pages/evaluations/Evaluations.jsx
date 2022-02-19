import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import {
    LinearProgress,
    Paper,
    Button,
    Tooltip,
    IconButton,
} from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";
import * as Database from "../../Database";
import EvaluationDialog from "./EvaluationDialog";
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
    newEvaluationField: {
        margin: "11px",
    },
    newEvaluationButton: {
        margin: 10,
    },
});

class Evaluations extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newEvaluationOpen: false,
            evaluationToEdit: null,
            evaluations: null,
        };

        this.subs = [];
    }

    async componentDidMount() {
        this.setState({ db: await Database.getClientDb() });

        const sub = this.state.db.scoringrule
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

    componentWillUnmount() {
        // Unsubscribe from all subscriptions
        this.subs.forEach((sub) => sub.unsubscribe());
    }

    async deleteEvaluation(id) {
        await this.state.db.scoringrule
            .findOne({
                selector: {
                    id: id,
                },
            })
            .remove();
    }

    render() {
        const { classes } = this.props;
        const { evaluations, newEvaluationOpen, evaluationToEdit } = this.state;

        return (
            <div>
                <Paper className={classes.newEvaluationField}>
                    <Button
                        className={classes.newEvaluationButton}
                        color='inherit'
                        variant='outlined'
                        color='primary'
                        onClick={() => {
                            this.setState({ newEvaluationOpen: true });
                        }}
                    >
                        Wertungsbogen erstellen
                    </Button>
                </Paper>
                <EvaluationDialog
                    open={newEvaluationOpen}
                    evaluationToEdit={evaluationToEdit}
                    handleClose={() =>
                        this.setState({
                            newEvaluationOpen: false,
                            evaluationToEdit: null,
                        })
                    }
                />
                {evaluations != null ? (
                    <MUIDataTable
                        className={classes.table}
                        data={evaluations}
                        columns={[
                            {
                                name: "id",
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: "name",
                                options: {
                                    filter: false,
                                    sort: true,
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
                                name: "boni",
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
                                                    <Tooltip title='Bearbeiten'>
                                                        <span>
                                                            <IconButton
                                                                onClick={() => {
                                                                    this.setState(
                                                                        {
                                                                            newEvaluationOpen:
                                                                                !newEvaluationOpen,
                                                                            evaluationToEdit:
                                                                                {
                                                                                    id: tableMeta
                                                                                        .rowData[0],
                                                                                    name: tableMeta
                                                                                        .rowData[1],
                                                                                    categories:
                                                                                        tableMeta
                                                                                            .rowData[2],
                                                                                    boni: tableMeta
                                                                                        .rowData[3],
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
                                                                    this.deleteEvaluation(
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
Evaluations.defaultProps = {
    routes: {
        routes: [
            {
                name: "default",
                path: "/evaluations",
                exact: true,
                component: <LinearProgress />,
                admin: false,
                icon: null,
                hide: true,
            },
        ],
    },
};

export default withStyles(styles, { withTheme: true })(withRouter(Evaluations));
