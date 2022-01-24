import React, { Component } from "react"
import { withRouter } from "react-router-dom"
import MUIDataTable from "mui-datatables"
import {
    LinearProgress,
    Paper,
    Button,
    Tooltip,
    IconButton,
    Typography,
} from "@material-ui/core"
import { TipsAndUpdates } from "@mui/icons-material"
import withStyles from "@material-ui/core/es/styles/withStyles"
import withProps from "../../components/HOC"
import { getCollection, closeCollection } from "../../Database"

const styles = (theme) => ({
    root: {
        flexGrow: 1,
        padding: 30,
    },
    table: {
        margin: "11px",
        marginBottom: "80px",
    },
    fetchAppointments: {
        margin: 10,
    },
    paper: {
        margin: "11px",
    },
    logo: {
        maxWidth: "10rem",
        maxHeight: "10rem",
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 20,
    },
    disabled: {
        filter: "opacity(50%) blur(1px)",
        "&:hover": {
            cursor: "default",
        },
    },
})

class Dashboard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            Competition: null,
        }

        this.subs = []
    }

    async componentDidMount() {
        let collection = await getCollection("competition")
        let sub = await collection.find().$.subscribe((Competition) => {
            if (!Competition) {
                return
            }
            console.log("reload Competition")
            console.dir(Competition)
            this.setState({
                Competition,
            })
        })

        this.subs.push(sub)
    }

    render() {
        const { classes } = this.props
        return <div>{this.state.Competition}</div>
    }
}

// Specifies the default values for props:
Dashboard.defaultProps = {
    routes: {
        routes: [
            {
                name: "default",
                path: "/",
                exact: true,
                component: <LinearProgress />,
                admin: false,
                icon: null,
                hide: true,
            },
        ],
    },
}

export default withStyles(styles, { withTheme: true })(Dashboard)
