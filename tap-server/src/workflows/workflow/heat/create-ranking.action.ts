import {IWorkflowAction} from "../workflow.action.interface";
import {RoundTransition} from "../../../enums/round-transition.enum";
import {Context} from "./context.model";

export class CreateRankingAction implements IWorkflowAction {
    entryAction(state: { trigger: (arg0: string) => void }, context: Context): void {
        console.log('CreateRankingAction.entry');
        context.value += 1
        state.trigger(RoundTransition.EVALUATE);
    }

    exitAction(state: { trigger: (arg0: string) => void }, context: Context): boolean {
        console.log('CreateRankingAction.exit');
        return true;
    }

}
