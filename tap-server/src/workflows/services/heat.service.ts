import {State, StateMachine} from "@edium/fsm";
import {InitializeAction} from "../workflow/heat/initialize.action";
import {Context} from "../workflow/heat/context.model";
import {BeginAction} from "../workflow/heat/begin.action";
import {AssessAction} from "../workflow/heat/assess.action";
import {CalculateAction} from "../workflow/heat/calculate.action";
import {RejectAction} from "../workflow/heat/reject.action";
import {EditAction} from "../workflow/heat/edit.action";
import {SubmitAction} from "../workflow/heat/submit.action";
import {CreateRankingAction} from "../workflow/heat/create-ranking.action";
import {FinishAction} from "../workflow/heat/finish.action";
import {ShowResultAction} from "../workflow/heat/show-result.action";
import {HeatState} from "../../enums/heat-state.enum";
import {HeatTransition} from "../../enums/heat-transition.enum";

export class HeatService {
    context: Context;
    stateMachine: StateMachine;

    initialize: State;
    begin: State;
    assess: State;
    calculate: State;
    reject: State;
    edit: State;
    submit: State;
    createRanking: State;
    showResult: State;
    finish: State;

    initializeAction: InitializeAction;
    beginAction: BeginAction;
    assessAction: AssessAction;
    calculateAction: CalculateAction;
    rejectAction: RejectAction;
    editAction: EditAction;
    submitAction: SubmitAction;
    createRankingAction: CreateRankingAction;
    showResultAction: ShowResultAction;
    finishAction: FinishAction;

    constructor() {
        this.context = new Context(42);
        this.stateMachine = new StateMachine('Heat workflow', this.context);

        this.initializeAction = new InitializeAction();
        this.beginAction = new BeginAction();
        this.assessAction = new AssessAction();
        this.calculateAction = new CalculateAction();
        this.rejectAction = new RejectAction();
        this.editAction = new EditAction();
        this.submitAction = new SubmitAction();
        this.createRankingAction = new CreateRankingAction();
        this.showResultAction = new ShowResultAction();
        this.finishAction = new FinishAction();
    }

    public async createWorkflow() {
        this.initialize = this.stateMachine.createState(HeatState.INITIALIZED, false, this.initializeAction.entryAction, this.initializeAction.exitAction);
        this.begin = this.stateMachine.createState(HeatState.STARTED, false, this.beginAction.entryAction, this.beginAction.exitAction);
        this.assess = this.stateMachine.createState(HeatState.ASSESSED, false, this.assessAction.entryAction, this.assessAction.exitAction);
        this.calculate = this.stateMachine.createState(HeatState.CALCULATE, false, this.assessAction.entryAction, this.assessAction.exitAction);
        this.reject = this.stateMachine.createState(HeatState.REJECT, false, this.assessAction.entryAction, this.assessAction.exitAction);
        this.edit = this.stateMachine.createState(HeatState.EDIT, false, this.assessAction.entryAction, this.assessAction.exitAction);
        this.submit = this.stateMachine.createState(HeatState.SUBMIT, false, this.assessAction.entryAction, this.assessAction.exitAction);
        this.createRanking = this.stateMachine.createState(HeatState.CREATE_RANKING, false, this.assessAction.entryAction, this.assessAction.exitAction);
        this.showResult = this.stateMachine.createState(HeatState.SHOW_RESULT, false, this.assessAction.entryAction, this.assessAction.exitAction);
        this.finish = this.stateMachine.createState(HeatState.FINISHED, true, this.finishAction.entryAction, this.finishAction.exitAction);

        // Define all state transitions
        this.initialize.addTransition(HeatTransition.BEGIN, this.begin);
        this.begin.addTransition(HeatTransition.ASSESS, this.assess);
        this.assess.addTransition(HeatTransition.CALCULATE, this.calculate);
        this.calculate.addTransition(HeatTransition.REJECT, this.reject);
        this.reject.addTransition(HeatTransition.CORRECT, this.calculate);
        this.calculate.addTransition(HeatTransition.EDIT, this.calculate);
        this.calculate.addTransition(HeatTransition.SUBMIT, this.submit);
        this.submit.addTransition(HeatTransition.RANK, this.createRanking);
        this.createRanking.addTransition(HeatTransition.PUBLISH, this.showResult);
        this.showResult.addTransition(HeatTransition.NEXT, this.begin);
        this.showResult.addTransition(HeatTransition.FINISH, this.finish);
    }

    public startWorkflow() {
        console.log('START HEAT WORKFLOW')
        this.stateMachine.start(this.initialize);
    }
}
