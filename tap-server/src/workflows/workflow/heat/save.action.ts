import {IWorkflowAction} from "../workflow.action.interface";
import {Context} from "./context.model";
import {RoundTransitionId} from "../../../../../shared/enums/round-transition-id.enum";

export class SaveAction implements IWorkflowAction {
    entryAction(state: { trigger: (arg0: string) => void }, context: Context): void {
        console.log('SaveAction.entry');
        state.trigger(RoundTransitionId.CREATE);
    }

    exitAction(state: { trigger: (arg0: string) => void }, context: Context): boolean {
        console.log('SaveAction.exit');
        return true;
    }

}
