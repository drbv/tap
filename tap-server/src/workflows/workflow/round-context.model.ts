import {Database} from "../../database";

export class Context {
    value: number;
    message: string;

    lastObj: any;

    randomize() {
        return Math.floor(Math.random() * 100);
    }

    constructor() {
    }

    public getDatabase() {
        return Database.getCurrentCompetitionDB();
    }
}
