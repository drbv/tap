import {JudgeState} from "../../enums/judge-state.enum";
import {JudgeTransition} from "../../enums/judge-transition.enum";
import {WorkflowBase} from "./workflow-base.service";
import {FSM} from "ea-state-machine";


export class HeatService extends WorkflowBase {

    protected states = {
        INITIALIZED: {name: JudgeState.INITIALIZED, onExit: () => console.log('on exit')},
        STARTED: {
            name: JudgeState.STARTED,
            onEnter: () => console.log('on enter'),
            onExit: () => console.log('on exit')
        },
        ASSESSED: {name: JudgeState.ASSESSED},
        CORRECTED: {name: JudgeState.CORRECTED},
        FINISHED: {name: JudgeState.FINISHED},
    }

    // TODO to be defined
    protected guards = {
        canMelt: (fsm: any, from: any, to: any) => fsm.data.temperature > 5,
    }

    protected transitions = {
        // Runde starten
        START: {
            name: JudgeTransition.START,
            from: this.states.INITIALIZED,
            to: this.states.STARTED,
            action: () => this.onStart(),
        },
        // Runde werten
        ASSESS: {
            name: JudgeTransition.ASSESS,
            from: this.states.STARTED,
            to: this.states.ASSESSED,
            action: (action: any) => this.onAssess(action),
        },
        // Runde beenden
        FINISH: {
            name: JudgeTransition.FINISH,
            from: this.states.ASSESSED,
            to: this.states.FINISHED,
            action: () => this.onFinish(),
        },
        // Wertung korrigieren
        CORRECT: {
            name: JudgeTransition.CORRECT,
            from: this.states.ASSESSED,
            to: this.states.CORRECTED,
            action: () => this.onCorrect(),
        },
        // Runde beenden
        CONFIRM: {
            name: JudgeTransition.CONFIRM,
            from: this.states.CORRECTED,
            to: this.states.FINISHED,
            action: () => this.onConfirm(),
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

    private onCorrect() {

    }

    private onConfirm() {

    }

    public changeData(data: any) {
    }
}
