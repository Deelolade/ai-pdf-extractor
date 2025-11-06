"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const connectDb = async () => {
    try {
        await mongoose_1.default.connect(env_1.MONGODB_URL);
        console.log(`connected to mongodb successfully !!`);
    }
    catch (error) {
        console.log('error connecting to mongodb', error);
        process.exit(1);
    }
};
exports.connectDb = connectDb;
