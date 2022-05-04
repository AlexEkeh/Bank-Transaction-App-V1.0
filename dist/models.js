"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.balancesDB = exports.transferFunds = exports.createNewAccount = exports.getSingleBal = exports.getAllBal = void 0;
const path_1 = __importDefault(require("path"));
const utility_1 = __importDefault(require("./utility"));
const balancesPath = path_1.default.join(__dirname, '..', 'balances.json');
const balancesDB = require(balancesPath);
exports.balancesDB = balancesDB;
const transactionsPath = path_1.default.join(__dirname, '..', 'transactions.json');
const transactionsDB = require(transactionsPath);
// GET ALL ACCOUNT INFORMATION FROM DATABASE
function getAllBal() {
    return new Promise((resolve, _reject) => {
        resolve(balancesDB);
    });
}
exports.getAllBal = getAllBal;
// GET SINGLE ACCOUNT INFORMATION BY ITS ACCOUNT NUMBER FROM DATABASE
function getSingleBal(accountNo) {
    return new Promise((resolve, _reject) => {
        const accountBalInfo = balancesDB.find((item) => item.accountNo == accountNo);
        resolve(accountBalInfo);
    });
}
exports.getSingleBal = getSingleBal;
// CREATE NEW ACCOUNT INFORMATION
function createNewAccount(content) {
    return new Promise((resolve, _reject) => {
        const newAccount = {
            accountNo: content.accountNo,
            balance: content.amount,
            createdAt: content.createdAt
        };
        balancesDB.push(newAccount);
        utility_1.default(balancesPath, balancesDB);
        resolve(newAccount);
    });
}
exports.createNewAccount = createNewAccount;
// TRANSFER FUNDS
function transferFunds(content) {
    return new Promise((resolve, _reject) => {
        const newTransactionData = {
            senderAccountNo: content.senderAccountNo,
            amount: content.amount,
            receiverAccountNo: content.receiverAccountNo
        };
        const senderAccountIndex = balancesDB.findIndex((item) => item.accountNo == content.senderAccountNo);
        const receiverAccountIndex = balancesDB.findIndex((item) => item.accountNo == content.receiverAccountNo);
        // SENDER ACCOUNT DETAILS
        balancesDB[senderAccountIndex] = {
            accountNo: content.senderAccountNo,
            balance: balancesDB[senderAccountIndex].balance - newTransactionData.amount,
            createdAt: content.createdAt
        };
        // RECEIVER ACCOUNT DETAILS
        balancesDB[receiverAccountIndex] = {
            accountNo: content.receiverAccountNo,
            balance: balancesDB[receiverAccountIndex].balance + newTransactionData.amount,
            createdAt: content.createdAt
        };
        utility_1.default(balancesPath, balancesDB);
        const padSenderAccountNo = String(content.senderAccountNo).replace(/.{5}/, '*****');
        const newBal = balancesDB[senderAccountIndex].balance;
        const updatedContent = {
            referenceId: content.referenceId,
            senderAccountNo: content.senderAccountNo,
            amount: content.amount,
            receiverAccountNo: content.receiverAccountNo,
            transferDescription: `Debit Transaction: N${content.amount} Transferred from ${padSenderAccountNo}. Bal: N${newBal}`,
            createdAt: content.createdAt,
        };
        transactionsDB.push(updatedContent);
        utility_1.default(transactionsPath, transactionsDB);
        resolve(updatedContent);
    });
}
exports.transferFunds = transferFunds;
//# sourceMappingURL=models.js.map