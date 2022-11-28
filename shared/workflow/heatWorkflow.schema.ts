import { WorkflowState } from "../enums/workflowState.enum";
import { ScoringRuleSchema } from "../schemas/scoringRule.schema";
import { TeamSchema } from "../schemas/team.schema";
import { FinalResult } from "./finalResult.schema";
import { HeatResult } from "./heatResult.schema";
import { Judge } from "./judge.schema";

export const HeatWorkflow = {
    title: "HeatWorkflow",
    description: "workflow object for a heat",
    version: 0,
    primaryKey: "id",
    type: "object",
    properties: {
        id: {
            type: "string",
            final: true,
        },
        type: {
            type: "string",
        },
        heat_id: {
            type: "string",
        },
        state: {
            type: "string",
            enum: WorkflowState,
        },
        judges: {
            type: "array",
            $ref: Judge,
        },
        observers: {
            type: "array",
            $ref: Judge,
        },
        timers: {
            type: "array",
            $ref: Judge,
        },
        teams: {
            type: "array",
            $ref: TeamSchema,
        },
        heat_results: {
            type: "array",
            $ref: HeatResult,
        },
        observer_results: {
            // TODO: Create object for observer Result
        },
        scoring_rule: {
            $ref: ScoringRuleSchema,
        },
        final_results: {
            type: "array",
            $ref: FinalResult,
        },
    },
    required: ["id", "type", "heat_id", "state"],
};
