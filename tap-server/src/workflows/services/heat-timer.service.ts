import {WorkflowBase} from "./workflow-base.service";
import {FSM} from "ea-state-machine";
import {HeatTimerState} from "../../enums/heat-timer-state.enum";
import {HeatTimerTransition} from "../../enums/heat-timer-transition.enum";
import {ObserverState} from "../../enums/observer-state.enum";


export class ObserverService extends WorkflowBase {

    protected states = {
        INITIALIZED: {name: HeatTimerState.INITIALIZED, onExit: () => console.log('on exit')},
        STARTED: {
            name: HeatTimerState.STARTED,
            onEnter: () => console.log('on enter'),
            onExit: () => console.log('on exit')
        },
        ASSESSED: {name: ObserverState.ASSESSED},
        FINISHED: {name: HeatTimerState.FINISHED},
    }

    // TODO to be defined
    protected guards = {
        canMelt: (fsm: any, from: any, to: any) => fsm.data.temperature > 5,
    }

    protected transitions = {
        // Runde starten
        START: {
            name: HeatTimerTransition.START,
            from: this.states.INITIALIZED,
            to: this.states.STARTED,
            action: () => this.onStart(),
        },
        // Runde werten
        ASSESS: {
            name: HeatTimerTransition.ASSESS,
            from: this.states.STARTED,
            to: this.states.ASSESSED,
            action: (action: any) => this.onAssess(action),
        },
        // Runde beenden
        FINISH: {
            name: HeatTimerTransition.FINISH,
            from: this.states.ASSESSED,
            to: this.states.FINISHED,
            action: () => this.onFinish(),
        },
    }

    protected environment = {};

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

    public changeData(data: any): void {
    }
}
