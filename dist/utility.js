"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
function writeDataToFile(filename, content) {
    fs_1.default.writeFile(filename, JSON.stringify(content, null, 2), "utf8", (err) => {
        if (err) {
            console.log(err);
        }
    });
}
exports.default = writeDataToFile;
//# sourceMappingURL=utility.js.map