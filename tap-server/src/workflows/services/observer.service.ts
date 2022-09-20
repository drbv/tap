import {WorkflowBase} from "./workflow-base.service";
import {FSM} from "ea-state-machine";
import {ObserverState} from "../../enums/observer-state.enum";
import {ObserverTransition} from "../../enums/observer-transition.enum";


export class ObserverService extends WorkflowBase {

    protected states = {
        INITIALIZED: {name: ObserverState.INITIALIZED, onExit: () => console.log('on exit')},
        STARTED: {
            name: ObserverState.STARTED,
            onEnter: () => console.log('on enter'),
            onExit: () => console.log('on exit')
        },
        ASSESSED: {name: ObserverState.ASSESSED},
        CONFIRMED: {name: ObserverState.CONFIRMED},
        FINISHED: {name: ObserverState.FINISHED},
    }

    // TODO to be defined
    protected guards = {
        canMelt: (fsm: any, from: any, to: any) => fsm.data.temperature > 5,
    }

    protected transitions = {
        // Runde starten
        START: {
            name: ObserverTransition.START,
            from: this.states.INITIALIZED,
            to: this.states.STARTED,
            action: () => this.onStart(),
        },
        // Runde werten
        ASSESS: {
            name: ObserverTransition.ASSESS,
            from: this.states.STARTED,
            to: this.states.ASSESSED,
            action: (action: any) => this.onAssess(action),
        },
        // Wertung ablehnen
        REJECT: {
            name: ObserverTransition.REJECT,
            from: this.states.ASSESSED,
            to: this.states.STARTED,
            action: () => this.onCorrect(),
        },
        // Wertung freigeben
        CONFIRM: {
            name: ObserverTransition.CONFIRM,
            from: this.states.ASSESSED,
            to: this.states.CONFIRMED,
            action: () => this.onConfirm(),
        },
        // Runde beenden
        FINISH: {
            name: ObserverTransition.FINISH,
            from: this.states.CONFIRMED,
            to: this.states.FINISHED,
            action: () => this.onFinish(),
        },
    }

    protected environment = {role: 'default'};

    protected fsm = new FSM(
        this.states, // all states
        this.transitions, // transition defitions between states
        this.states.INITIALIZED, // optional: start state, if omitted, a transition to the first state needs to happen
        this.environment // optional: associated data with the state machine
    );

    private onStart() {
    }

    private onAssess(action: any) {
    }

    private onFinish() {

    }

    private onCorrect() {

    }

    private onConfirm() {

    }

    public changeData(data: any) {
    }
}
