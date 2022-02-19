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
import withStyles from "@material-ui/core/es/styles/withStyles";

import { isRxDatabase, isRxCollection } from "rxdb";

import withProps from "../../components/HOC";
import { getCollection, closeCollection } from "../../Database";
import CoupleDialog from "./AthleteDialog";

const styles = (theme) => ({
    root: {
        flexGrow: 1,
        padding: 30,
    },
    table: {
        margin: "11px",
        marginBottom: "80px",
    },
    newCoupleField: {
        margin: "11px",
    },
    newCoupleButton: {
        margin: 10,
    },
});

class Athletes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newCoupleOpen: false,
            coupleToEdit: null,
            Athletes: null,
        };

        this.subs = [];
    }

    async componentDidMount() {
        let collection = await getCollection("athletes");
        let sub = await collection.find().$.subscribe((Athletes) => {
            if (!Athletes) {
                return;
            }
            console.log("reload Athletes-list ");
            console.dir(Athletes);
            this.setState({
                Athletes,
            });
        });

        this.subs.push(sub);
    }

    componentWillUnmount() {
        // Unsubscribe from all subscriptions
        this.subs.forEach((sub) => sub.unsubscribe());
    }

    async deleteCouple(rfid) {
        let collection = await getCollection("athletes");
        collection
            .findOne({
                selector: {
                    rfid: rfid,
                },
            })
            .remove();
    }

    render() {
        const { classes } = this.props;
        const { Athletes, newCoupleOpen, coupleToEdit } = this.state;

        return (
            <div>
                <Paper className={classes.newCoupleField}>
                    <Button
                        className={classes.newCoupleButton}
                        color='inherit'
                        variant='outlined'
                        color='primary'
                        onClick={() => {
                            this.setState({ newCoupleOpen: true });
                        }}
                    >
                        Tanzpaar hinzufügen
                    </Button>
                </Paper>
                <CoupleDialog
                    open={newCoupleOpen}
                    coupleToEdit={coupleToEdit}
                    handleClose={() =>
                        this.setState({
                            newCoupleOpen: false,
                            coupleToEdit: null,
                        })
                    }
                />
                {Athletes != null ? (
                    <MUIDataTable
                        className={classes.table}
                        data={Athletes}
                        columns={[
                            {
                                name: "rfid",
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: "book_id",
                                options: {
                                    filter: true,
                                    sort: true,
                                },
                            },
                            {
                                name: "pre_name",
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                            },
                            {
                                name: "family_name",
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                            },
                            {
                                name: "birth_year",
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                            },
                            {
                                name: "sex",
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                            },
                            {
                                name: "club_id",
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                            },
                            {
                                name: "club_name_short",
                                options: {
                                    excluded: true,
                                    sort: true,
                                },
                            },
                            {
                                name: "organization",
                                options: {
                                    excluded: true,
                                    sort: true,
                                },
                            },
                            {
                                name: "sport",
                                options: {
                                    sort: true,
                                },
                            },
                            {
                                name: "Aktionen",
                                options: {
                                    sort: false,
                                    customBodyRender: (
                                        value,
                                        tableMeta,
                                        updateValue
                                    ) => {
                                        if (tableMeta.rowData != null) {
                                            return (
                                                <div>
                                                    {/*<Tooltip title="Bearbeiten">
                                                        <span>
                                                            <IconButton
                                                                onClick={() => {
                                                                    this.setState(
                                                                        {
                                                                            newCoupleOpen:
                                                                                !newCoupleOpen,
                                                                            coupleToEdit:
                                                                                {
                                                                                    id: tableMeta
                                                                                        .rowData[0],
                                                                                    class: tableMeta
                                                                                        .rowData[1],
                                                                                    number: tableMeta
                                                                                        .rowData[2],
                                                                                    nameOneFirst:
                                                                                        tableMeta
                                                                                            .rowData[3],
                                                                                    nameOneSecond:
                                                                                        tableMeta
                                                                                            .rowData[4],
                                                                                    nameTwoFirst:
                                                                                        tableMeta
                                                                                            .rowData[5],
                                                                                    nameTwoSecond:
                                                                                        tableMeta
                                                                                            .rowData[6],
                                                                                    clubNumber:
                                                                                        tableMeta
                                                                                            .rowData[7],
                                                                                    clubName:
                                                                                        tableMeta
                                                                                            .rowData[8],
                                                                                    coupleNumber:
                                                                                        tableMeta
                                                                                            .rowData[9],
                                                                                },
                                                                        }
                                                                    )
                                                                }}
                                                            >
                                                                <Edit />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>*/}
                                                    <Tooltip title='Entfernen'>
                                                        <span>
                                                            <IconButton
                                                                onClick={() => {
                                                                    this.deleteCouple(
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
Athletes.defaultProps = {
    routes: {
        routes: [
            {
                name: "default",
                path: "/Athletes",
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
    withRouter(withProps(Athletes))
);
