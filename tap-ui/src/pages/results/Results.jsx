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
import { getCollection } from "../../Database";

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
    };

    this.subs = [];
  }

  async componentDidMount() {
    getCollection("result").then(async (collection) => {
      const sub = await collection.find().$.subscribe((results) => {
        if (!results) {
          return;
        }
        console.log("reload results-list ");
        console.dir(results);
        this.setState({
          results,
        });
      });
      this.subs.push(sub);
    });
  }

  componentWillUnmount() {
    // Unsubscribe from all subscriptions
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  async deleteResult(id) {
    getCollection("result").then(async (collection) => {
      await collection
        .findOne({
          selector: {
            resultId: id,
          },
        })
        .remove();
    });
  }

  render() {
    const { classes } = this.props;
    const { results } = this.state;

    return (
      <div>
        {this.state.results != null ? (
          <MUIDataTable
            className={classes.table}
            data={results}
            columns={[
              {
                name: "resultId",
                options: {
                  filter: false,
                },
              },
              {
                name: "bookId",
                options: {
                  filter: false,
                },
              },
              {
                name: "roundId",
                options: {
                  filter: false,
                  sort: true,
                },
              },
              {
                name: "judgeId",
                options: {
                  filter: false,
                  sort: true,
                },
              },
              {
                name: "categories",
                options: {
                  filter: false,
                  sort: true,
                  customBodyRender: (value) => {
                    return JSON.stringify(value);
                  },
                },
              },
              {
                name: "deduction",
                options: {
                  filter: false,
                  sort: true,
                  customBodyRender: (value) => {
                    return JSON.stringify(value);
                  },
                },
              },
              {
                name: "ready",
                options: {
                  filter: false,
                  sort: true,
                  customBodyRender: (value) => {
                    return JSON.stringify(value);
                  },
                },
              },
              {
                name: "Aktionen",
                options: {
                  filter: false,
                  sort: false,
                  customBodyRender: (value, tableMeta, updateValue) => {
                    if (tableMeta.rowData != null) {
                      return (
                        <div>
                          <Tooltip title="Entfernen">
                            <span>
                              <IconButton
                                onClick={() => {
                                  this.deleteResult(tableMeta.rowData[0]);
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
