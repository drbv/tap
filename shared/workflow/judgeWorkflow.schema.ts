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
            enum: WorkflowState,
        },
        teams: {
            type: "array",
            $ref: TeamSchema,
        },
        heat_results: {
            type: "array",
            $ref: HeatResult,
        },
        scoring_rule: {
            $ref: ScoringRuleSchema,
        },
    },
    required: ["id", "judge_id", "heat_id", "state"],
};
