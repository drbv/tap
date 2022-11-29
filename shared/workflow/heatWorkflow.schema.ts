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
            items: { $ref: Judge },
        },
        //TODO: create a schema for observers
        observers: {
            type: "array",
            items: { $ref: Judge },
        },
        //TODO: create a schema for Timers
        timers: {
            type: "array",
            items: { $ref: Judge },
        },
        teams: {
            type: "array",
            items: { $ref: TeamSchema },
        },
        heat_results: {
            type: "array",
            items: { $ref: HeatResult },
        },
        observer_results: {
            // TODO: Create object for observer Result
        },
        scoring_rule: {
            $ref: ScoringRuleSchema,
        },
        final_results: {
            type: "array",
            items: { $ref: FinalResult },
        },
    },
    required: ["id", "type", "heat_id", "state"],
};
