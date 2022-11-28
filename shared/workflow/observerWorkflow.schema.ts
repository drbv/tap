import { WorkflowState } from "../enums/workflowState.enum";
import { ScoringRuleSchema } from "../schemas/scoringRule.schema";
import { TeamSchema } from "../schemas/team.schema";
import { Judge } from "./judge.schema";
import { RoundType } from "./roundType.schema";

export const ObserverWorkflow = {
    title: "ObserverWorkflow",
    description: "workflow object for observer",
    version: 0,
    primaryKey: "id",
    type: "object",
    properties: {
        id: {
            type: "string",
            final: true,
        },
        judge_id: {
            type: "string",
        },
        heat_id: {
            type: "string",
        },
        state: {
            type: "string",
            enum: WorkflowState,
        },
        type: {
            $ref: RoundType,
        },
        teams: {
            type: "array",
            $ref: TeamSchema,
        },
        heat_results: {
            type: "array",
            items: "TODO",
        },
        observer_results: {
            type: "array",
            items: "TODO",
        },
        scoring_rule: {
            $ref: ScoringRuleSchema,
        },
        judges: {
            type: "array",
            $ref: Judge,
        },
    },
    required: ["id", "judge_id", "heat_id", "state"],
};
