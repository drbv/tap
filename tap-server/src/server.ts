import express from "express";
import * as PouchDB from "pouchdb";
import config from "config";
import { RoundService } from "./services/round.service";
import { Database } from "./database";

// let websocketState: any;
// let server: any;
const port: number = config.get("port");

//const roundService: RoundService = new RoundService();

var app = express();

app.use(
    "/db",
    require("express-pouchdb")(PouchDB.defaults({ prefix: "./db/" }))
);

app.listen(5002);

var sampledb = Database.getSampleDB();
console.log(sampledb.changes());

sampledb.post({
    request: "sample-request",
    response: "sample-response",
});

console.log(sampledb.changes());
