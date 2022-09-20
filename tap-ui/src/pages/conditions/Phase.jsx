import { withRouter } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import {
    LinearProgress,
    Paper,
    Button,
    Tooltip,
    IconButton,
} from "@material-ui/core";
import { Component } from "react";
import * as Database from "../../Database";
import PhaseDialog from "./PhaseDialog";
import { Edit, Delete } from "@mui/icons-material";
import withStyles from "@material-ui/core/es/styles/withStyles";

const styles = (theme) => ({
    table: {
        margin: "11px",
        marginBottom: "80px",
    },
    newPhaseField: {
        margin: "11px",
    },
    newPhaseButton: {
        margin: 10,
    },
});

class Phase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newPhaseOpen: false,
            phaseToEdit: null,
            PhaseList: null,
        };

        this.subs = [];
    }

    async componentDidMount() {
        this.setState({ db: await Database.getClientDb() });

        const sub = this.state.db.phase.find().$.subscribe((PhaseList) => {
            if (!PhaseList) {
                return;
            }
            console.log("reload Phase-list ");
            console.dir(PhaseList);
            this.setState({
                PhaseList,
            });
        });
        this.subs.push(sub);
    }

    componentWillUnmount() {
        // Unsubscribe from all subscriptions
        this.subs.forEach((sub) => sub.unsubscribe());
    }

    async deletePhase(id) {
        await this.state.db.phase.findOne({ selector: { id: id } }).remove();
    }

    render() {
        const { classes } = this.props;
        const { PhaseList, newPhaseOpen, phaseToEdit } = this.state;

        return (
            <div>
                <Paper className={classes.newPhaseField}>
                    <Button
                        className={classes.newPhaseButton}
                        color="inherit"
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                            this.setState({ newPhaseOpen: true });
                        }}
                    >
                        Station hinzufügen
                    </Button>
                </Paper>
                <PhaseDialog
                    open={newPhaseOpen}
                    phaseToEdit={phaseToEdit}
                    handleClose={() =>
                        this.setState({
                            newPhaseOpen: false,
                            phaseToEdit: null,
                        })
                    }
                />
                {PhaseList != null ? (
                    <MUIDataTable
                        className={classes.table}
                        data={PhaseList}
                        columns={[
                            {
                                name: "phase_id",
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: "name",
                                options: { filter: false, sort: true },
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
                                                                            newPhaseOpen:
                                                                                !newPhaseOpen,
                                                                            PhaseToEdit:
                                                                                {
                                                                                    phase_id:
                                                                                        tableMeta
                                                                                            .rowData[0],
                                                                                    name: tableMeta
                                                                                        .rowData[1],
                                                                                },
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
                                                                    this.deletePhase(
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
Phase.defaultProps = {
    routes: {
        routes: [
            {
                name: "default",
                path: "/Phase",
                exact: true,
                component: <LinearProgress />,
                admin: false,
                icon: null,
                hide: true,
            },
        ],
    },
};

export default withStyles(styles, { withTheme: true })(Phase);
