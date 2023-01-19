import { JsonSchema, RxJsonSchema } from "rxdb";
import { WorkflowState } from "../enums/workflowState.enum";
import { ScoringRuleSchema } from "./scoringRule.schema";
import { TeamSchema } from "./team.schema";
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
    heat_type: {
      type: "string",
    },
    state: {
      type: "string",
      enum: Object.values(WorkflowState),
    },
    judges: {
      type: "array",
      items: Judge,
    },
    //TODO: create a schema for observers
    observers: {
      type: "array",
      items: Judge,
    },
    //TODO: create a schema for Timers
    timers: {
      type: "array",
      items: Judge,
    },
    teams: {
      type: "array",
      items: TeamSchema,
    },
    heat_results: {
      type: "array",
      items: HeatResult,
    },
    observer_results: {
      // TODO: Create object for observer Result
    },
    scoring_rule: ScoringRuleSchema,
    final_results: {
      type: "array",
      items: FinalResult,
    },
  },
  required: ["id", "heat_type", "state"],
};
