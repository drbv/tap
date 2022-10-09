import {FSM} from "ea-state-machine";
import {HeatState} from "../../enums/heat-state.enum";
import {HeatTransition} from "../../enums/heat-transition.enum";


export class HeatService {

    private states = {
        INITIALIZED: {name: HeatState.INITIALIZED},
        STARTED: {name: HeatState.STARTED},
        ASSESSED: {name: HeatState.ASSESSED},
        CALCULATED: {name: HeatState.CALCULATED},
        RESULT_RELEASED: {name: HeatState.RESULT_RELEASED},
        FINISHED: {name: HeatState.FINISHED},
    }

    // TODO to be defined
    guards = {
        canMelt: (fsm: any, from: any, to: any) => fsm.data.temperature > 5,
    }

    private transitions = {
        // Runde starten
        START: {
            name: HeatTransition.START,
            from: this.states.INITIALIZED,
            to: this.states.STARTED,
            action: () => this.onStart(),
        },
        // Runde werten
        ASSESS: {
            name: HeatTransition.ASSESS,
            from: this.states.STARTED,
            to: this.states.ASSESSED,
            action: (action: any) => this.onAssess(action),
        },
        CALCULATE: {
            name: HeatTransition.CALCULATE,
            from: this.states.ASSESSED,
            to: this.states.CALCULATED,
            action: () => this.onCalculate(),
        },
        REJECT: {
            name: HeatTransition.REJECT,
            from: this.states.CALCULATED,
            to: this.states.ASSESSED,
            action: () => this.onReject(),
        },
        CORRECT: {
            name: HeatTransition.CORRECT,
            from: this.states.ASSESSED,
            to: this.states.CALCULATED,
            action: () => this.onCorrect(),
        },
        EDIT: {
            name: HeatTransition.EDIT,
            from: this.states.CALCULATED,
            to: this.states.CALCULATED,
            action: () => this.onEdit(),
        },
        RELEASE_RESULT: {
            name: HeatTransition.RELEASE_RESULT,
            from: this.states.CALCULATED,
            to: this.states.RESULT_RELEASED,
            action: () => this.onReleaseResult(),
        },
        NEXT_HEAT: {
            name: HeatTransition.NEXT_HEAT,
            from: this.states.RESULT_RELEASED,
            to: this.states.STARTED,
            action: () => this.onNextHeat(),
        },
        FINISH: {
            name: HeatTransition.FINISH,
            from: this.states.RESULT_RELEASED,
            to: this.states.FINISHED,
            action: () => this.onNextHeat(),
        },
    }

    private environment = {role: 'default'};

    private fsm = new FSM(
        this.states, // all states
        this.transitions, // transition defitions between states
        this.states.INITIALIZED, // optional: start state, if omitted, a transition to the first state needs to happen
        this.environment // optional: associated data with the state machine
    );


    private onStart() {
    }

    private onAssess(action: any) {
        if (action.fsm.data.role === 'judge') {
            console.log('judge has spoken')
        }
        if (action.fsm.data.role === 'observer') {
            console.log('observer has spoken')
        }
        if (action.fsm.data.role === 'time') {
            console.log('time has spoken')
        }
    }

    private onSubmit() {

    }

    private onCalculate() {

    }

    private onReject() {

    }

    private onCorrect() {

    }

    private onEdit() {

    }

    private onReleaseResult() {

    }

    private onNextHeat() {

    }

    private onFinish() {

    }

    private getRestartOption() {
        // TODO define restart option HEAT or ROUND
    }

    public getCurrentState() {
        return this.fsm.currentState;
    }

    public changeData(role: string) {
        return this.fsm.changeData({role});
    }

    public startHeat() {
        this.fsm.transitionTo(this.states.STARTED);
    }

    public assess() {

    }
}
