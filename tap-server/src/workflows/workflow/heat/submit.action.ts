import {IWorkflowAction} from "../workflow.action.interface";
import {Context} from "./context.model";

export class SubmitAction implements IWorkflowAction {
    entryAction(state: { trigger: (arg0: string) => void }, context: Context): void {
        console.log('SubmitAction.entry');
        console.log('context: ', context.value)
    }

    exitAction(state: { trigger: (arg0: string) => void }, context: Context): boolean {
        console.log('SubmitAction.exit');
        return false;
    }

}
