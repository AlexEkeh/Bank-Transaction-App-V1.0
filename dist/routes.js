"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = require("./controllers");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// WELCOME PAGE
router.get('/', controllers_1.homepage);
// GET ALL ACCOUNTS AND THEIR BALANCE
router.get('/balance', controllers_1.getAllBalance);
// GET BALANCE FOR A PARTICULAR ACCOUNT NUMBER
router.get('/balance/:accountNo', controllers_1.getSingleBalance);
// ENABLE A USER TO CREATE AN ACCOUNT
router.post('/create-account', controllers_1.createAccount);
// MAKE A TRANSFER TRANSACTION TO ANOTHER ACCOUNT
router.post('/transfer', controllers_1.transfer);
exports.default = router;
//# sourceMappingURL=routes.js.map