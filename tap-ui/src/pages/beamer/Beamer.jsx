import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { LinearProgress } from '@material-ui/core'
import withStyles from '@material-ui/core/es/styles/withStyles'

const styles = {}

class Beamer extends Component {
    render() {
        return <div>Beamer</div>
    }
}

// Specifies the default values for props:
Beamer.defaultProps = {
    routes: {
        routes: [
            {
                name: 'default',
                path: '/Beamer',
                exact: true,
                component: <LinearProgress />,
                admin: false,
                icon: null,
                hide: true,
            },
        ],
    },
}

export default withStyles(styles, { withTheme: true })(Beamer)
