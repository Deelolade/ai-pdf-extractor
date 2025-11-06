"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flw = void 0;
const Flutterwave = require('flutterwave-node-v3');
const env_1 = require("./env");
exports.flw = new Flutterwave(env_1.FLW_PUBLIC_KEY, env_1.FLW_SECRET_KEY);
