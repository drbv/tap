import {IWorkflowAction} from "../workflow.action.interface";
import {Context} from "./context.model";
import {RoundTransitionId} from "../../../../../shared/enums/round-transition-id.enum";

export class EditAction implements IWorkflowAction {
    entryAction(state: { trigger: (arg0: string) => void }, context: Context): void {
        console.log('EditAction.entry');
        state.trigger(RoundTransitionId.SAVE);
    }

    exitAction(state: { trigger: (arg0: string) => void }, context: Context): boolean {
        console.log('EditAction.exit');
        return true;
    }

}
