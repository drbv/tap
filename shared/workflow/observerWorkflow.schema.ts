import { JsonSchema, RxJsonSchema } from "rxdb";
import { WorkflowState } from "../enums/workflowState.enum";
import { ScoringRuleSchema } from "../schemas/scoringRule.schema";
import { TeamSchema } from "../schemas/team.schema";
import { HeatResult } from "./heatResult.schema";
import { Judge } from "./judge.schema";
import { RoundType } from "./roundType.schema";

export const ObserverWorkflow = {
    // title: "ObserverWorkflow",
    description: "workflow object for observer",
    // version: 0,
    // primaryKey: "id",
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
            enum: Object.values(WorkflowState),
        },
        round_type: RoundType,
        teams: {
            type: "array",
            items: TeamSchema,
        },
        heat_results: {
            type: "array",
            items: HeatResult,
        },
        observer_results: {
            type: "array",
            items: HeatResult,
        },
        scoring_rule: ScoringRuleSchema,
        judges: {
            type: "array",
            items: Judge,
        },
    },
    required: ["id", "judge_id", "heat_id", "state", "round_type"],
};
