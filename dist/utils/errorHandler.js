"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};
exports.errorHandler = errorHandler;
