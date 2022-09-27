import {State, StateMachine} from "@edium/fsm";
import {StartAction} from "../workflow/round/start.action";
import {InitializeAction} from "../workflow/round/initialize.action";
import {EvaluateAction} from "../workflow/round/evaluate.action";
import {CreateAction} from "../workflow/round/create.action";
import {FinishAction} from "../workflow/round/finish.action";
import {Context} from "../workflow/round/context.model";
import {RoundState} from "../../enums/round-state.enum";
import {RoundTransition} from "../../enums/round-transition.enum";
import {EditAction} from "../workflow/round/edit.action";
import {SaveAction} from "../workflow/round/save.action";

export class RoundService {
    context: Context;
    stateMachine: StateMachine;

    initialize: State;
    create: State;
    edit: State;
    start: State;
    evaluate: State;
    finish: State;

    initializeAction: InitializeAction;
    createAction: CreateAction;
    startAction: StartAction;
    editAction: EditAction;
    saveAction: SaveAction;
    evaluateAction: EvaluateAction;
    finishAction: FinishAction;

    constructor() {
        this.context = new Context(42);
        this.stateMachine = new StateMachine('Round workflow', this.context);

        this.initializeAction = new InitializeAction();
        this.createAction = new CreateAction();
        this.startAction = new StartAction();
        this.editAction = new EditAction();
        this.saveAction = new SaveAction();
        this.evaluateAction = new EvaluateAction();
        this.finishAction = new FinishAction();
    }

    public async createWorkflow() {
        this.initialize = this.stateMachine.createState(RoundState.INITIALIZED, false, this.initializeAction.entryAction, this.initializeAction.exitAction);
        this.create = this.stateMachine.createState(RoundState.CREATED, false, this.createAction.entryAction, this.createAction.exitAction);
        this.edit = this.stateMachine.createState(RoundState.EDITED, false, this.editAction.entryAction, this.editAction.exitAction);
        this.start = this.stateMachine.createState(RoundState.STARTED, false, this.startAction.entryAction, this.startAction.exitAction);
        this.evaluate = this.stateMachine.createState(RoundState.EVALUATED, false, this.evaluateAction.entryAction, this.evaluateAction.exitAction);
        this.finish = this.stateMachine.createState(RoundState.FINISHED, true, this.finishAction.entryAction, this.finishAction.exitAction);

        // Define all state transitions
        this.initialize.addTransition(RoundTransition.CREATE, this.create);
        this.create.addTransition(RoundTransition.START, this.start);
        this.start.addTransition(RoundTransition.EDIT, this.edit);
        this.edit.addTransition(RoundTransition.SAVE, this.start);
        this.start.addTransition(RoundTransition.EVALUATE, this.evaluate);
        this.evaluate.addTransition(RoundTransition.TRANSFER, this.finish);
        this.evaluate.addTransition(RoundTransition.FINISH, this.finish);
    }

    public startWorkflow() {
        console.log('START ROUND WORKFLOW')
        this.stateMachine.start(this.initialize);
    }
}
