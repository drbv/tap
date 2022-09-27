import {IWorkflowAction} from "../workflow.action.interface";
import {RoundTransition} from "../../../enums/round-transition.enum";
import {Context} from "./context.model";

export class EditAction implements IWorkflowAction {
    entryAction(state: { trigger: (arg0: string) => void }, context: Context): void {
        console.log('EditAction.entry');
        context.value += 1
        state.trigger(RoundTransition.EVALUATE);
    }

    exitAction(state: { trigger: (arg0: string) => void }, context: Context): boolean {
        console.log('EditAction.exit');
        return true;
    }

}
