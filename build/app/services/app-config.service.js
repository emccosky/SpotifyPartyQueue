"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var keys_json_1 = __importDefault(require("../../rsc/keys.json"));
var AppConfigService = /** @class */ (function () {
    function AppConfigService() {
        this.readFile();
    }
    AppConfigService.prototype.readFile = function () {
        console.log(keys_json_1.default.data);
    };
    return AppConfigService;
}());
exports.AppConfigService = AppConfigService;
