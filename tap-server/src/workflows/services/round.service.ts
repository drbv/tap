import {State, StateMachine} from "@edium/fsm";
import {StartAction} from "../workflow/start.action";
import {InitializeAction} from "../workflow/initialize.action";
import {EvaluateAction} from "../workflow/evaluate.action";
import {CreateAction} from "../workflow/create.action";
import {FinishAction} from "../workflow/finish.action";
import {WaitAction} from "../workflow/wait.action";
import {Context} from "../workflow/context.model";
import {StateId} from "../../enums/state.id.enum";
import {TransitionId} from "../../enums/transition.id.enum";

export class RoundService {
    context: Context;
    stateMachine: StateMachine;

    initialize: State;
    create: State;
    start: State;
    evaluate: State;
    wait: State;
    finish: State;

    initializeAction: InitializeAction;
    createAction: CreateAction;
    startAction: StartAction;
    evaluateAction: EvaluateAction;
    waitAction: EvaluateAction;
    finishAction: FinishAction;

    constructor() {
        this.context = new Context(42);
        this.stateMachine = new StateMachine('Round workflow', this.context);

        this.initializeAction = new InitializeAction();
        this.createAction = new CreateAction();
        this.startAction = new StartAction();
        this.evaluateAction = new EvaluateAction();
        this.waitAction = new WaitAction();
        this.finishAction = new FinishAction();
    }

    public async createWorkflow() {
        this.initialize = this.stateMachine.createState(StateId.INITIALIZED, false, this.initializeAction.entryAction, this.initializeAction.exitAction);
        this.create = this.stateMachine.createState(StateId.CREATED, false, this.createAction.entryAction, this.createAction.exitAction);
        this.start = this.stateMachine.createState(StateId.STARTED, false, this.startAction.entryAction, this.startAction.exitAction)
        this.evaluate = this.stateMachine.createState(StateId.EVALUATED, false, this.evaluateAction.entryAction, this.evaluateAction.exitAction);
        this.wait = this.stateMachine.createState(StateId.WAITED, false, this.waitAction.entryAction, this.waitAction.exitAction);
        this.finish = this.stateMachine.createState(StateId.FINISHED, true, this.finishAction.entryAction, this.finishAction.exitAction);

        // Define all state transitions
        this.initialize.addTransition(TransitionId.CREATE, this.create);
        this.create.addTransition(TransitionId.START, this.start);
        this.create.addTransition(TransitionId.EDIT, this.start);
        this.start.addTransition(TransitionId.EVALUATE, this.evaluate);
        this.evaluate.addTransition(TransitionId.WAIT, this.wait);
        this.evaluate.addTransition(TransitionId.TRANSFER, this.finish);
        this.evaluate.addTransition(TransitionId.FINISH, this.finish);
        this.wait.addTransition(TransitionId.EVALUATE, this.evaluate);
    }

    public startWorkflow() {
        console.log('START WORKFLOW')
        this.stateMachine.start(this.initialize);
    }
}
