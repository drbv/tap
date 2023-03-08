import express from "express";
import {Database} from "./database";
import config from "config";
import {RoundService} from "./services/round.service";

// let websocketState: any;
// let server: any;
const port: number = config.get("port");

const roundService: RoundService = new RoundService();

async function initialize() {
    const db = await Database.getSampleDB();
}

initialize();