import { FSM } from "ea-state-machine";
import { dbCount } from "rxdb";
import { HeatState } from "../../enums/heat-state.enum";
import { HeatTransition } from "../../enums/heat-transition.enum";
import { WorkflowBase } from "./workflow-base.service";
import { Database } from "../../database";
import { HeatWorkflow } from "../../../../shared/workflow/heatWorkflow.schema";

export class HeatService extends WorkflowBase {
    protected states = {
        INITIALIZED: {
            name: HeatState.INITIALIZED,
            onExit: () => console.log("on exit"),
        },
        STARTED: {
            name: HeatState.STARTED,
            onEnter: () => console.log("on enter"),
            onExit: () => console.log("on exit"),
        },
        ASSESSED: { name: HeatState.ASSESSED },
        CALCULATED: { name: HeatState.CALCULATED },
        RESULT_RELEASED: { name: HeatState.RESULT_RELEASED },
        FINISHED: { name: HeatState.FINISHED },
    };

    // TODO to be defined
    protected guards = {
        canMelt: (fsm: any, from: any, to: any) => fsm.data.temperature > 5,
    };

    protected transitions = {
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
            action: () => this.onFinish(),
        },
    };

    protected environment = { role: "default" };

    protected fsm = new FSM(
        this.states, // all states
        this.transitions, // transition defitions between states
        this.states.INITIALIZED, // optional: start state, if omitted, a transition to the first state needs to happen
        this.environment // optional: associated data with the state machine
    );

    /**
     * defines the operation executed when the heat.service is started
     */
    private async onStart() {}

    private onAssess(action: any) {
        // TODO instantiate observer, judge and heat-timer workflow
        if (action.fsm.data.role === "judge") {
            console.log("judge has spoken");
        }
        if (action.fsm.data.role === "observer") {
            console.log("observer has spoken");
        }
        if (action.fsm.data.role === "time") {
            console.log("time has spoken");
        }
    }
    private onCalculate() {
        console.log("on calc");
    }

    private onEdit() {}

    private onReleaseResult() {}

    private onNextHeat() {}

    private onFinish() {}

    private getRestartOption() {
        // TODO define restart option HEAT or ROUND
    }

    public changeData(role: string) {
        return this.fsm.changeData({ role });
    }

    public startHeat(id: string) {
        this.fsm.transitionTo(this.states.STARTED, id);
    }

    public assess() {
        this.fsm.transitionTo(this.states.ASSESSED);
    }
}
