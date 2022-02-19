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
import withProps from "../../components/HOC";
import * as Database from "../../Database";

const styles = (theme) => ({
    root: {
        flexGrow: 1,
        padding: 30,
    },
    table: {
        margin: "11px",
        marginBottom: "80px",
    },
    newResultField: {
        margin: "11px",
    },
    newResultButton: {
        margin: 10,
    },
});

class Results extends Component {
    constructor(props) {
        super(props);

        this.state = {
            results: null,
            couples: null,
            resultsets: null,
        };

        this.subs = [];
    }

    async componentDidMount() {
        this.setState({ db: await Database.getClientDb() });

        const resultSub = this.state.db.results
            .find()
            .$.subscribe((results) => {
                if (!results) {
                    return;
                }
                console.log("reload results-list ");
                console.dir(results);
                this.setState({
                    results,
                });

                this.createResultSets();
            });
        this.subs.push(resultSub);

        const coupleSub = await this.state.db.couples
            .find()
            .$.subscribe((couples) => {
                if (!couples) {
                    return;
                }
                console.log("reload couples-list ");
                console.dir(couples);
                this.setState({
                    couples,
                });

                this.createResultSets();
            });
        this.subs.push(coupleSub);
    }

    componentWillUnmount() {
        // Unsubscribe from all subscriptions
        this.subs.forEach((sub) => sub.unsubscribe());
    }

    createResultSets() {
        const { couples, results } = this.state;
        let resultsets = [];

        if (couples) {
            couples.map((couple) => {
                let matchingResult = null;

                if (results) {
                    matchingResult = results.find(
                        (result) => result.coupleId == couple.id
                    );
                }

                if (matchingResult) {
                    resultsets.push({
                        id: matchingResult.id,
                        coupleId: couple.id,
                        nameOneFirst: couple.nameOneFirst,
                        nameOneSecond: couple.nameOneSecond,
                        nameTwoFirst: couple.nameTwoFirst,
                        nameTwoSecond: couple.nameTwoSecond,
                        result: matchingResult.result,
                    });
                } else {
                    resultsets.push({
                        id: "?",
                        coupleId: couple.id,
                        nameOneFirst: couple.nameOneFirst,
                        nameOneSecond: couple.nameOneSecond,
                        nameTwoFirst: couple.nameTwoFirst,
                        nameTwoSecond: couple.nameTwoSecond,
                        result: "?",
                    });
                }
            });
        }
        this.setState(resultsets);
    }

    render() {
        const { classes } = this.props;
        const { resultsets } = this.state;

        return (
            <div>
                {this.state.results != null ? (
                    <MUIDataTable
                        className={classes.table}
                        data={this.state.results}
                        columns={[
                            {
                                name: "id",
                                options: {
                                    filter: false,
                                },
                            },
                            {
                                name: "coupleId",
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                            },
                            {
                                name: "nameOneFirst",
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                            },
                            {
                                name: "nameOneSecond",
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                            },
                            {
                                name: "nameTwoFirst",
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                            },
                            {
                                name: "nameTwoSecond",
                                options: {
                                    filter: false,
                                    sort: true,
                                },
                            },
                            {
                                name: "result",
                                options: {
                                    filter: false,
                                    sort: true,
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
Results.defaultProps = {
    routes: {
        routes: [
            {
                name: "default",
                path: "/results",
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
    withRouter(withProps(Results))
);
