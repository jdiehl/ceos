"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ceos = void 0;
require("reflect-metadata");
const typedi_1 = require("typedi");
const typeorm_1 = require("typeorm");
const Ceos_1 = require("./Ceos");
__exportStar(require("./Ceos"), exports);
__exportStar(require("./Config"), exports);
__exportStar(require("./CRUDResolver"), exports);
__exportStar(require("./Database"), exports);
__exportStar(require("./errors"), exports);
__exportStar(require("./Extension"), exports);
__exportStar(require("./JSONObject"), exports);
__exportStar(require("./Mail"), exports);
__exportStar(require("./Server"), exports);
__exportStar(require("./util"), exports);
typeorm_1.useContainer(typedi_1.Container);
// return the ceos instance
function ceos() {
    return typedi_1.Container.get(Ceos_1.Ceos);
}
exports.ceos = ceos;
