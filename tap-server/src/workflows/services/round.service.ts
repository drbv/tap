import {RoundState} from "../../enums/round-state.enum";
import {RoundTransition} from "../../enums/round-transition.enum";
import {FSM} from "ea-state-machine";
import {Context} from "../workflow/round-context.model";


export class RoundService {

    private states = {
        INITIALIZED: {name: RoundState.INITIALIZED},
        CREATED: {name: RoundState.CREATED},
        DRAWN: {name: RoundState.DRAWN},
        STARTED: {name: RoundState.STARTED},
        EVALUATED: {name: RoundState.EVALUATED},
        TRANSFERRED: {name: RoundState.TRANSFERRED},
        FINISHED: {name: RoundState.FINISHED},
    }

    guards = {
        canMelt: (fsm: any, from: any, to: any) => fsm.data.temperature > 5,
        canVaporize: (fsm: any, from: any, to: any) => fsm.data.temperature > 100,
        canCondense: (fsm: any, from: any, to: any) => fsm.data.temperature < 100,
        canFreeze: (fsm: any, from: any, to: any) => fsm.data.temperature >= 0
    }

    private transitions = {
        // Tanzrunde erstellen
        CREATE: {
            name: RoundTransition.CREATE,
            from: this.states.INITIALIZED, // can be a single state
            to: [this.states.CREATED], // or multiple targets
            action: () => this.onCreate(),
        },
        // Tanzrunde ändern
        EDIT: {
            name: RoundTransition.EDIT,
            from: this.states.CREATED, // can be a single state
            to: [this.states.CREATED], // or multiple targets
            action: () => this.onEdit(),
        },
        // Tanzrunde auslosen
        DRAW: {
            name: RoundTransition.DRAW,
            from: this.states.CREATED, // can be a single state
            to: [this.states.DRAWN], // or multiple targets
            action: () => this.onDraw(),
        },
        // Auslosung ändern
        MODIFY: {
            name: RoundTransition.MODIFY,
            from: this.states.DRAWN, // can be a single state
            to: [this.states.DRAWN], // or multiple targets
            action: () => this.onModify(),
        },
        // Tanzrunde ändern
        CHANGE: {
            name: RoundTransition.CHANGE,
            from: this.states.DRAWN, // can be a single state
            to: [this.states.CREATED], // or multiple targets
            action: () => this.onChange(),
        },
        // Tanzrunde starten
        START: {
            name: RoundTransition.START,
            from: this.states.DRAWN, // can be a single state
            to: [this.states.STARTED], // or multiple targets
            action: () => this.onStart(),
        },
        // Tanzrunde oder Heat neustarten
        RESTART: {
            name: RoundTransition.RESTART,
            from: this.states.STARTED, // can be a single state
            to: [this.states.STARTED], // or multiple targets
            data: () => this.getRestartOption(),
            action: () => this.onRestart(),
        },
        // Tanzrunde auswerten
        EVALUATE: {
            name: RoundTransition.EVALUATE,
            from: this.states.STARTED, // can be a single state
            to: [this.states.EVALUATED], // or multiple targets
            action: () => this.onEvaluate(),
        },
        // Teams in die nächste Tanzrunde nehmen
        TRANSFER: {
            name: RoundTransition.TRANSFER,
            from: this.states.STARTED, // can be a single state
            to: [this.states.TRANSFERRED], // or multiple targets
            action: () => this.onTransfer(),
        },
        // Tanzrunde auslosen
        DRAW_NEXT: {
            name: RoundTransition.DRAW_NEXT,
            from: this.states.TRANSFERRED, // can be a single state
            to: [this.states.DRAWN], // or multiple targets
            action: () => this.onDraw(),
        },
        // Tanzrunde beenden
        FINISH: {
            name: RoundTransition.FINISH,
            from: this.states.EVALUATED, // can be a single state
            to: [this.states.FINISHED], // or multiple targets
            action: () => this.onFinish(),
        },
    }

    private environment = new Context();

    private fsm = new FSM(
        this.states, // all states
        this.transitions, // transition defitions between states
        this.states.INITIALIZED, // optional: start state, if omitted, a transition to the first state needs to happen
        this.environment // optional: associated data with the state machine
    );

    private onCreate() {
        console.log('on create');
    }

    private onEdit() {

    }

    private onDraw() {

    }

    private onModify() {

    }

    private onChange() {

    }

    private onStart() {

    }

    private onRestart() {

    }

    private onEvaluate() {

    }

    private onTransfer() {

    }

    private onFinish() {

    }

    private getRestartOption() {
        // TODO define restart option HEAT or ROUND
    }

    public getCurrentState() {
        return this.fsm.currentState;
    }

    public createRound() {
        if (!this.fsm.canTransitionTo(this.states.CREATED)) {
            return;
        }
        this.fsm.transitionTo(this.states.CREATED);
    }

    public drawRound() {
        if (!this.fsm.canTransitionTo(this.states.CREATED) && !this.fsm.canTransitionTo(this.states.EVALUATED)) {
            return;
        }

        this.fsm.changeData({temperature: 10});
        this.fsm.transitionTo(this.states.DRAWN)
    }
}
