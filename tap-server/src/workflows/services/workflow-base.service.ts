import {FSM} from "ea-state-machine";


export abstract class WorkflowBase {

    protected abstract states: any;
    protected abstract guards: any;

    protected abstract transitions: any;
    protected abstract environment: any;

    protected abstract fsm: FSM;

    public abstract changeData(data: any): void;

    public getCurrentState() {
        return this.fsm.currentState;
    }
}
