import React, { lazy } from 'react'
import ReactDOM from 'react-dom'
import { createTheme, MuiThemeProvider } from '@material-ui/core'
import Provider from './components/Provider'
import App from './components/App'
import blue from '@material-ui/core/es/colors/blue'
import red from '@material-ui/core/colors/red'
import {
    AccountTree,
    Apps,
    Home,
    PeopleAlt,
    AccountBox,
    Airplay,
    PlaylistAddCheck,
    Description,
    AccountBalance,
    ModelTraining,
} from '@mui/icons-material'
import { green, yellow } from '@material-ui/core/colors'

const BaseData = lazy(() => import('./pages/baseData/BaseData'))
const Conditions = lazy(() => import('./pages/conditions/Conditions'))
const Users = lazy(() => import('./pages/users/Users'))
const Athletes = lazy(() => import('./pages/athletes/Athletes'))
const Rounds = lazy(() => import('./pages/rounds/Rounds'))
const Results = lazy(() => import('./pages/results/Results'))
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'))
const Beamer = lazy(() => import('./pages/beamer/Beamer'))
const Current = lazy(() => import('./pages/current/Current'))

/**
 * A theme with custom primary and secondary color.
 */
const theme = createTheme({
    palette: {
        primary: {
            light: blue[300],
            main: blue[500],
            dark: blue[700],
        },
        red: {
            light: red[300],
            main: red[500],
            dark: red[700],
        },
        green: {
            light: green[300],
            main: green[500],
            dark: green[700],
        },
        secondary: {
            light: red[300],
            main: red[500],
            dark: red[700],
        },
    },
    typography: {
        useNextVariants: true,
    },
    transitions: {
        duration: {
            enteringScreen: 500,
            leavingScreen: 500,
        },
    },
    overrides: {
        MUIDataTable: {
            responsiveScroll: {
                maxHeight: '100%',
            },
        },
    },
})

const Routes = [
    /*{
        name: 'Dashboard',
        path: '/',
        exact: true,
        component: <Dashboard />,
        icon: <Home />,
    },
  {
    name: 'Beameransicht',
    path: '/beamer',
    exact: true,
    component: <Beamer />,
    icon: <Airplay />,
  },ModelTraining
    {
        name: 'Laufende Runden',
        path: '/current',
        exact: true,
        component: <Current />,
        admin: false,
        icon: <Apps />,
    },
    {
        name: 'Ergebnisse',
        path: '/results',
        exact: true,
        component: <Results />,
        admin: false,
        icon: <Description />,
    },
    {
        name: 'Teilnehmerliste',
        path: '/athletes',
        exact: true,
        component: <Athletes />,
        admin: true,
        icon: <PeopleAlt />,
    },
    {
        name: 'Rundeneinstellungen',
        path: '/round',
        exact: true,
        component: <Rounds />,
        admin: true,
        icon: <AccountTree />,
    },
    {
        name: 'Wertungsbögen',
        path: '/evaluations',
        exact: true,
        component: <Evaluations />,
        admin: true,
        icon: <PlaylistAddCheck />,
    },*/
    {
        name: 'Aktivenportal-Daten',
        path: '/base',
        exact: true,
        component: <BaseData />,
        admin: true,
        icon: <AccountBalance />,
    },
    {
        name: 'Turniereinstellungen',
        path: '/conditions',
        exact: true,
        component: <Conditions />,
        admin: true,
        icon: <ModelTraining />,
    },
    {
        name: 'Nutzerverwaltung',
        path: '/user',
        exact: true,
        component: <Users />,
        admin: true,
        icon: <AccountBox />,
    },
]

function ReactIsInDevelomentMode() {
    return '_self' in React.createElement('div')
}

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <React.StrictMode>
            <Provider>
                <App routes={Routes} />
            </Provider>
        </React.StrictMode>
    </MuiThemeProvider>,
    document.getElementById('root')
)

if (ReactIsInDevelomentMode()) module.hot.accept()
