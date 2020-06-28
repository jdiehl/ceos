"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeBlankKeys = exports.wait = void 0;
function wait(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}
exports.wait = wait;
function removeBlankKeys(obj) {
    for (const key of Object.keys(obj)) {
        if (obj[key] === undefined)
            delete obj[key];
    }
    return obj;
}
exports.removeBlankKeys = removeBlankKeys;
