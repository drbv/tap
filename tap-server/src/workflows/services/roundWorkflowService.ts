import {RoundState} from "../../enums/round-state.enum";
import {RoundTransition} from "../../enums/round-transition.enum";
import {FSM} from "ea-state-machine";
import {Context} from "../workflow/round-context.model";
import {WorkflowBase} from "./workflow-base.service";
import {Observable, Subscription} from "rxjs";
import {RxChangeEvent} from "rxdb";


export class RoundWorkflowService extends WorkflowBase {


    constructor(environment: Context) {
        super();
        this.environment = environment;
    }

    protected states = {
        INITIALIZED: {name: RoundState.INITIALIZED},
        CREATED: {name: RoundState.CREATED},
        DRAWN: {name: RoundState.DRAWN},
        STARTED: {name: RoundState.STARTED},
        EVALUATED: {name: RoundState.EVALUATED},
        TRANSFERRED: {name: RoundState.TRANSFERRED},
        FINISHED: {name: RoundState.FINISHED},
    }

    // TODO to be defined
    protected guards = {
        canMelt: (fsm: any, from: any, to: any) => fsm.data.temperature > 5,
    }

    protected transitions = {
        // Tanzrunde erstellen
        CREATE: {
            name: RoundTransition.CREATE,
            from: this.states.INITIALIZED, // can be a single state
            to: this.states.CREATED, // or multiple targets
            action: () => this.onCreate(),
        },
        // Tanzrunde ändern
        EDIT: {
            name: RoundTransition.EDIT,
            from: this.states.CREATED,
            to: this.states.CREATED,
            action: () => this.onEdit(),
        },
        // Tanzrunde auslosen
        DRAW: {
            name: RoundTransition.DRAW,
            from: this.states.CREATED,
            to: this.states.DRAWN,
            action: () => this.onDraw(),
        },
        // Auslosung ändern
        MODIFY: {
            name: RoundTransition.MODIFY,
            from: this.states.DRAWN,
            to: this.states.DRAWN,
            action: () => this.onModify(),
        },
        // Tanzrunde ändern
        CHANGE: {
            name: RoundTransition.CHANGE,
            from: this.states.DRAWN,
            to: this.states.CREATED,
            action: () => this.onChange(),
        },
        // Tanzrunde starten
        START: {
            name: RoundTransition.START,
            from: this.states.DRAWN,
            to: this.states.STARTED,
            action: () => this.onStart(),
        },
        // Tanzrunde oder Heat neustarten
        RESTART: {
            name: RoundTransition.RESTART,
            from: this.states.STARTED,
            to: this.states.STARTED,
            data: () => this.getRestartOption(),
            action: () => this.onRestart(),
        },
        // Tanzrunde auswerten
        EVALUATE: {
            name: RoundTransition.EVALUATE,
            from: this.states.STARTED,
            to: this.states.EVALUATED,
            action: () => this.onEvaluate(),
        },
        // Teams in die nächste Tanzrunde nehmen
        TRANSFER: {
            name: RoundTransition.TRANSFER,
            from: this.states.STARTED,
            to: this.states.TRANSFERRED,
            action: () => this.onTransfer(),
        },
        // Tanzrunde auslosen
        DRAW_NEXT: {
            name: RoundTransition.DRAW_NEXT,
            from: this.states.TRANSFERRED,
            to: this.states.DRAWN,
            action: () => this.onDraw(),
        },
        // Tanzrunde beenden
        FINISH: {
            name: RoundTransition.FINISH,
            from: this.states.EVALUATED,
            to: this.states.FINISHED,
            action: () => this.onFinish(),
        },
    }

    protected environment;

    protected fsm = new FSM(
        this.states, // all states
        this.transitions, // transition definitions between states
        this.states.INITIALIZED, // optional: start state, if omitted, a transition to the first state needs to happen
        this.environment // optional: associated data with the state machine
    );
    private observable: Observable<RxChangeEvent<any>>;

    private onCreate() {
        console.log('on create');

        console.log('env: ', this.environment.message);
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
        // TODO instantiate heat workflow
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

    public changeData(data: any): void {
    }

    public createRound() {
        if (!this.fsm.canTransitionTo(this.states.CREATED)) {
            return;
        }
        this.fsm.transitionTo(this.states.CREATED);
        this.drawRound();
    }

    public drawRound() {
        if (!this.fsm.canTransitionTo(this.states.CREATED) && !this.fsm.canTransitionTo(this.states.EVALUATED)) {
            return;
        }

        this.fsm.changeData({temperature: 10});
        this.fsm.transitionTo(this.states.DRAWN);
    }

    public startRound() {
        if (!this.fsm.canTransitionTo(this.states.STARTED)) {
            return;
        }

        this.fsm.transitionTo(this.states.STARTED);
    }

    public evaluateRound() {
        if (!this.fsm.canTransitionTo(this.states.STARTED)) {
            return;
        }

        this.fsm.transitionTo(this.states.STARTED);
    }

}
