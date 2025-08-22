"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomSleep = randomSleep;
const sleep_1 = require("./sleep");
async function randomSleep(min = 500, max = 2000) {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    return (0, sleep_1.sleep)(ms);
}
