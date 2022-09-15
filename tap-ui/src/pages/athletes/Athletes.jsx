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
import { Translate, withLocalize } from "react-localize-redux";
import athleteTranslations from "../../translations/athletes.json";

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
        this.props.addTranslation(athleteTranslations);
    }

    async componentDidMount() {
        let collection = await getCollection(
            "competition",
            this.props.competitionId
        );
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

    render() {
        const { classes, translate } = this.props;
        const { Athletes, newCoupleOpen, coupleToEdit } = this.state;

        return (
            <div>
                {/* <Paper className={classes.newCoupleField}>
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
                </Paper> */}
                {/* <CoupleDialog
                    open={newCoupleOpen}
                    coupleToEdit={coupleToEdit}
                    handleClose={() =>
                        this.setState({
                            newCoupleOpen: false,
                            coupleToEdit: null,
                        })
                    }
                /> */}
                {Athletes != null ? (
                    <MUIDataTable
                        className={classes.table}
                        data={Athletes}
                        columns={[
                            {
                                name: "series",
                                options: {
                                    filter: true,
                                    sort: true,
                                    display: "excluded",
                                },
                            },
                            {
                                name: "league",
                                label: translate("athlete.league"),
                                options: {
                                    filter: false,
                                    sort: true,
                                    customBodyRender: (
                                        value,
                                        tableMeta,
                                        updateValue
                                    ) => {
                                        return translate(
                                            "athlete.leagues." + value
                                        );
                                    },
                                },
                            },
                            {
                                name: "club_id",
                                options: {
                                    filter: false,
                                    sort: true,
                                    display: "excluded",
                                },
                            },
                            {
                                name: "bookId",
                                label: translate("athlete.bookId"),
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                            },
                            {
                                name: "acros",
                                options: {
                                    display: "excluded",
                                    customBodyRender: (
                                        value,
                                        tableMeta,
                                        updateValue
                                    ) => {
                                        if (value != null) {
                                            return JSON.stringify(value);
                                        }
                                    },
                                },
                            },
                            {
                                name: "replacement_acros",
                                options: {
                                    display: "excluded",
                                    customBodyRender: (
                                        value,
                                        tableMeta,
                                        updateValue
                                    ) => {
                                        if (value != null) {
                                            return JSON.stringify(value);
                                        }
                                    },
                                },
                            },
                            {
                                name: "music",
                                options: {
                                    display: "excluded",
                                    customBodyRender: (
                                        value,
                                        tableMeta,
                                        updateValue
                                    ) => {
                                        if (value != null) {
                                            return JSON.stringify(value);
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
    withLocalize(withProps(withRouter(Athletes)))
);
