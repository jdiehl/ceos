"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ceos = exports.use = void 0;
__exportStar(require("./Bootstrapper"), exports);
__exportStar(require("./Config"), exports);
__exportStar(require("./Database"), exports);
__exportStar(require("./Extension"), exports);
__exportStar(require("./JSONObject"), exports);
__exportStar(require("./Mail"), exports);
__exportStar(require("./Server"), exports);
__exportStar(require("./errors"), exports);
__exportStar(require("./types"), exports);
require("reflect-metadata");
const typedi_1 = require("typedi");
const _1 = require(".");
const bootstrapper = typedi_1.Container.get(_1.Bootstrapper);
// register an extension
function use(Ext) {
    const extension = typedi_1.Container.get(Ext);
    bootstrapper.use(extension);
}
exports.use = use;
// initialize extensions and start the server
async function ceos() {
    return bootstrapper.start();
}
exports.ceos = ceos;
