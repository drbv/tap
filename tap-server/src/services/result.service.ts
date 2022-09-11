import { Database } from "../database";
import { RxDatabaseBase } from "rxdb/dist/types/rx-database";
import { CollectionsOfDatabase, RxDatabase, RxDatabaseGenerated } from "rxdb";
import { FinalResultSchema } from "../../../shared/schemas/finalResult.schema";
import { resolve } from "path";

export class ResultService {
    private db: RxDatabaseBase<any, any> &
        CollectionsOfDatabase &
        RxDatabaseGenerated<CollectionsOfDatabase>;

    private sumCategories(categories: any[]): number {
        let sum = 0;
        categories.map((category) => {
            sum += category.value;
        });
        return sum;
    }

    private averageCategories(categories: any[]): number {
        const numberCategories = categories.length;
        let sum = 0;

        // to avoid division by 0
        if (numberCategories <= 0) {
            return 0;
        }

        categories.map((category) => {
            sum += this.sumCategories(category);
        });
        return 0 / numberCategories;
    }

    public async joinResultParts(
        roundId: string,
        bookId: string
    ): Promise<void> {
        this.db = await Database.getBaseDB();

        if (this.db === null) {
            console.error("cannot access database");
        }

        // load round definition
        const currentRound = await this.db.round
            .findOne({
                selector: {
                    roundId: roundId,
                },
            })
            .exec();

        // load all heatResults
        const heatResults = await this.db.result
            .find({
                selector: {
                    roundId: roundId,
                    bookId: bookId,
                    ready: true,
                },
            })
            .exec();

        // split heatResults by judgeType
        const basicResults: any[] = [];
        const acroResults: any[] = [];
        const observerResults = [];

        // check if all heatResults from all judgeIds exist
        currentRound.judgeIds.map((judgeId: string) => {
            const personalHeatResult = heatResults.find(
                (heatResult) => heatResult.judgeId === judgeId
            );
            if (personalHeatResult === undefined) {
                // there is no result of judge
            } else {
                basicResults.push(personalHeatResult);
            }
        });

        // check if all heatResults from all acroJudgeIds exist
        currentRound.acroJudgeIds.map((acroJudgeId: string) => {
            const personalHeatResult = heatResults.find(
                (heatResult) => heatResult.judgeId === acroJudgeId
            );
            if (personalHeatResult === undefined) {
                // there is no result of acroJudge
            } else {
                acroResults.push(personalHeatResult);
            }
        });

        // check if all heatResults from all observerIds exist
        currentRound.observerIds.map((observerId: string) => {
            const personalHeatResult = heatResults.find(
                (heatResult) => heatResult.judgeId === observerId
            );
            if (personalHeatResult === undefined) {
                // there is no result of observer
            } else {
                observerResults.push(personalHeatResult);
            }
        });

        // calculate final basicPoints
        const basicResultsCopy = basicResults.slice();
        if (basicResults.length > 3) {
            basicResultsCopy.sort(function (a, b) {
                if (
                    this.sumCategories(a.categories) >
                    this.sumCategories(b.categories)
                )
                    return 1;
                if (
                    this.sumCategories(a.categories) <
                    this.sumCategories(b.categories)
                )
                    return -1;
                return 0;
            });

            //remove the top element and lowest element
            basicResultsCopy.shift();
            basicResultsCopy.pop();
        }
        const basicFinalPoints = this.averageCategories(basicResultsCopy);

        // calculate final acroPoints
        const acroResultsCopy = acroResults.slice();
        if (acroResults.length > 3) {
            acroResultsCopy.sort(function (a, b) {
                if (
                    this.sumCategories(a.categories) >
                    this.sumCategories(b.categories)
                )
                    return 1;
                if (
                    this.sumCategories(a.categories) <
                    this.sumCategories(b.categories)
                )
                    return -1;
                return 0;
            });

            //remove the top element and lowest element
            acroResultsCopy.shift();
            acroResultsCopy.pop();
        }
        const acroFinalPoints = this.averageCategories(acroResultsCopy);

        // calculate final deduction
        // equalize deductions from judges and observers
        const finalDeductions = {};
        const finalDeductionPoints = 0;

        // generate a finalPoints from acroFinalPoints, basicFinalPoints and finalDeductions
        const finalPoints =
            acroFinalPoints + basicFinalPoints - finalDeductionPoints;

        // write elements to objects
        const roundResult = {
            bookId,
            roundId,
            resultParts: heatResults,
            acroPoints: acroFinalPoints,
            basicPoints: basicFinalPoints,
            finalPoints: finalPoints,
            state: "FINISHED",
        };
        this.db.round_result.insert(roundResult);

        // // modify heatResults as edited
        // heatResults.map((heatResult, index) => {
        //     const updatedHeatResult = heatResult;
        //     // TODO: change status of heatResult
        //     heatResults[index] = updatedHeatResult;
        // });
        // this.db.result.upsert(heatResults);
    }
}
