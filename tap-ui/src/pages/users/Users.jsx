import React, { Component } from "react";
import withRouter from "../../components/withRouter";
import MUIDataTable from "mui-datatables";
import {
    LinearProgress,
    Paper,
    Button,
    Tooltip,
    IconButton,
} from "@material-ui/core";
import withStyles from "@material-ui/core/es/styles/withStyles";
import { Edit, Delete } from "@mui/icons-material";
import { isRxDatabase, isRxCollection } from "rxdb";

import withProps from "../../components/HOC";
import { getCollection } from "../../Database";
import UserDialog from "./UserDialog";

const styles = (theme) => ({
    root: {
        flexGrow: 1,
        padding: 30,
    },
    table: {
        margin: "11px",
        marginBottom: "80px",
    },
    newUserField: {
        margin: "11px",
    },
    newUserButton: {
        margin: 10,
    },
});

class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newUserOpen: false,
            userToEdit: null,
            users: null,
        };

        this.subs = [];
    }

    async componentDidMount() {
        getCollection("user", this.props.competitionId).then((collection) => {
            const sub = collection.find().$.subscribe((users) => {
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
    }

    componentWillUnmount() {
        // Unsubscribe from all subscriptions
        this.subs.forEach((sub) => sub.unsubscribe());
    }

    async deleteUser(id) {
        getCollection("user", this.props.competitionId).then(
            async (collection) => {
                await collection
                    .findOne({
                        selector: {
                            id: id,
                        },
                    })
                    .remove();
            }
        );
    }

    render() {
        const { classes } = this.props;
        const { users, newUserOpen, userToEdit } = this.state;

        return (
            <div>
                <Paper className={classes.newUserField}>
                    <Button
                        className={classes.newUserButton}
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                            this.setState({ newUserOpen: true });
                        }}
                    >
                        Nutzer hinzufügen
                    </Button>
                    <Button
                        className={classes.newUserButton}
                        variant="outlined"
                        color="primary"
                    >
                        Wertungsrichter importieren
                    </Button>
                </Paper>
                <UserDialog
                    open={newUserOpen}
                    userToEdit={userToEdit}
                    handleClose={() =>
                        this.setState({
                            newUserOpen: false,
                            userToEdit: null,
                        })
                    }
                />
                {users != null ? (
                    <MUIDataTable
                        className={classes.table}
                        data={users}
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
                                name: "key",
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                            },
                            {
                                name: "role",
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                            },
                            {
                                name: "Aktionen",
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
                                                                            newUserOpen:
                                                                                !newUserOpen,
                                                                            userToEdit:
                                                                                {
                                                                                    id: tableMeta
                                                                                        .rowData[0],
                                                                                    name: tableMeta
                                                                                        .rowData[1],
                                                                                    role: tableMeta
                                                                                        .rowData[3],
                                                                                    key: tableMeta
                                                                                        .rowData[2],
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
                                                                    this.deleteUser(
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
Users.defaultProps = {
    routes: {
        routes: [
            {
                name: "default",
                path: "/users",
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
    withProps(withRouter(Users))
);
