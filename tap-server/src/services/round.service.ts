import {RoundWorkflowService} from "../workflows/services/roundWorkflowService";
import {Subscription} from "rxjs";
import {Database} from "../database";
import {Context} from "../workflows/workflow/round-context.model";

export class RoundService {

    private context = new Context();
    private roundWorkflowService: RoundWorkflowService = new RoundWorkflowService(this.context);
    private subscription: Subscription;

    public createRound() {
        this.context.message = "change context here with data from db";
        Database.getSampleDB().then(db => {
            console.log('subscribing...')
            this.subscription = db.sampleCollection.$.subscribe((data: any) => this.onCreateRound(data));
            this.roundWorkflowService.createRound();
        });
    }

    private onCreateRound(data: any) {
        console.log(data);

        if (data.input === "start") {
            console.log(data.input);
            this.roundWorkflowService.startRound()
        }
    }
}
