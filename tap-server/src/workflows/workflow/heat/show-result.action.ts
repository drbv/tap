import {IWorkflowAction} from "../workflow.action.interface";
import {Context} from "./context.model";

export class ShowResultAction implements IWorkflowAction {
    entryAction(state: { trigger: (arg0: string) => void }, context: Context): void {
        console.log('ShowResultAction.entry');
        console.log('context: ', context.value)
    }

    exitAction(state: { trigger: (arg0: string) => void }, context: Context): boolean {
        console.log('ShowResultAction.exit');
        return false;
    }

}
