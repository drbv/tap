import React, { Component } from "react";
import ls from "local-storage";
import { withLocalize } from "react-localize-redux";

import { getCollection, getBaseCollection } from "../Database";

export const Context = React.createContext();

class Provider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: null,
            loginError: "",
            user: null,
            loadUser: (id, key) => this.loadUser(id, key),
            logout: () => this.logout(),
            appointment: null,
            competitionId: null,
        };
        this.subs = [];
    }

    async componentDidMount() {
        getBaseCollection("current_competition").then(async (collection) => {
            const sub = await collection
                .findOne()
                .$.subscribe((currentCompetition) => {
                    console.log("reload currentCompetition");
                    console.dir(currentCompetition);
                    const competitionId = currentCompetition
                        ? currentCompetition.competition_id
                        : null;
                    if (
                        this.state.competitionId &&
                        this.state.competitionId != competitionId
                    ) {
                        //clear page and reload subscriptions
                        //TODO: find more elegant solution
                        window.location.reload();
                    }
                    this.setState({
                        competitionId: currentCompetition
                            ? currentCompetition.competition_id
                            : null,
                    });
                });
            this.subs.push(sub);
        });

        this.checkAuth();
    }

    componentWillUnmount() {
        // Unsubscribe from all subscriptions
        this.subs.forEach((sub) => sub.unsubscribe());
    }

    checkAuth() {
        console.log("Checking Authentication for user");
        //check if the user has logged in before
        if (ls("userID") !== null && ls("userKey") !== null) {
            console.log("Load user from last session");
            let userID = ls("userID").toString();
            let userKey = ls("userKey").toString();

            //load current User
            this.loadUser(userID, userKey);
        } else {
            this.logout();
        }
    }

    logout() {
        localStorage.removeItem("userID");
        localStorage.removeItem("userKey");
        this.setState({
            user: null,
            isLoggedIn: false,
            loginError: null,
        });
    }

    async loadUser(id, key) {
        let currentUser = await getCollection(
            "user",
            this.props.competitionId
        ).then((collection) =>
            collection
                .findOne({
                    selector: { id: id, key: key },
                })
                .exec()
        );

        console.dir(currentUser);

        if (!currentUser) {
            console.log("Error: User with crendentials not found");
            this.logout();
            this.setState({
                loginError: "Nutzer oder Schlüssel falsch",
            });
        } else {
            this.setState({
                user: currentUser,
                isLoggedIn: true,
                loginError: "",
            });
            localStorage.setItem("userID", currentUser.id);
            localStorage.setItem("userKey", currentUser.key);

            console.log("Successful logged in user");
        }
    }

    render() {
        return (
            <Context.Provider value={this.state}>
                {this.props.children}
            </Context.Provider>
        );
    }
}

export default withLocalize(Provider);
