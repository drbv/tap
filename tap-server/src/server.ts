import express from "express";
import { Database } from "./database";
import config from "config";
import { RoundService } from "./services/round.service";

const port: number = config.get("port");

const roundService: RoundService = new RoundService();

const db = Database.getSampleDB();
