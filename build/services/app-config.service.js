"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var keys_json_1 = __importDefault(require("../rsc/keys.json"));
var AppConfigService = /** @class */ (function () {
    function AppConfigService() {
    }
    AppConfigService.prototype.getClientId = function () {
        return keys_json_1.default.client_id;
    };
    AppConfigService.prototype.getClientSecret = function () {
        return keys_json_1.default.client_secret;
    };
    return AppConfigService;
}());
exports.AppConfigService = AppConfigService;
