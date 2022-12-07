import { JsonSchema, RxJsonSchema } from "rxdb";
import { WorkflowState } from "../enums/workflowState.enum";
import { ScoringRuleSchema } from "../schemas/scoringRule.schema";
import { TeamSchema } from "../schemas/team.schema";
import { HeatResult } from "./heatResult.schema";

export const JudgeWorkflow = {
    title: "JudgeWorkflow",
    description: "workflow object for judges",
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
            enum: Object.values(WorkflowState),
        },
        teams: {
            type: "array",
            items: TeamSchema,
        },
        heat_results: {
            type: "array",
            items: HeatResult,
        },
        scoring_rule: ScoringRuleSchema,
    },
    required: ["id", "judge_id", "heat_id", "state"],
};
