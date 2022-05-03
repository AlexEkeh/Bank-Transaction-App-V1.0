"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transfer = exports.createAccount = exports.getSingleBalance = exports.getAllBalance = void 0;
const models_1 = require("./models");
const nanoid_1 = require("nanoid");
const uuid_1 = require("uuid");
// GET ALL BALANCES IN THE DATABASE
const getAllBalance = async (_req, res, next) => {
    try {
        const contents = await models_1.getAllBal();
        if (!contents) {
            res.status(404).json({ message: 'ACCOUNT INFORMATION NOT FOUND!' });
        }
        res.status(200).json(contents);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllBalance = getAllBalance;
// GET A BALANCE DETAILS BY UNIQUE ACCOUNT NUMBER
const getSingleBalance = async (req, res, next) => {
    try {
        let getAccountId = req.params.accountNo;
        const content = await models_1.getSingleBal(getAccountId);
        if (!content) {
            res.status(404).json({ message: "ACCOUNT NUMBER DOES NOT EXIST!" });
        }
        else {
            res.status(200).json(content);
        }
    }
    catch (error) {
        next(error);
    }
};
exports.getSingleBalance = getSingleBalance;
// CREATE NEW ACCOUNT
const createAccount = async (req, res, next) => {
    try {
        const { balance } = req.body;
        // VALIDATION FOR OPENING ACCOUNT BALANCE
        if ((typeof balance) == 'string') {
            res.status(400).json({ message: "ACCOUNT OPENING BALANCE CANNOT BE STRING!" });
        }
        else {
            const content = {
                accountNo: nanoid_1.nanoid(),
                balance,
                createdAt: new Date().toISOString()
            };
            if (content.balance < 0) {
                res.status(400).json({ message: `ACCOUNT OPENING BALANCE MUST BE GREATER THAN ZERO!` });
            }
            else {
                const newAccountInfo = await models_1.createNewAccount(content);
                res.status(201).json(newAccountInfo);
            }
        }
    }
    catch (error) {
        next(error);
    }
};
exports.createAccount = createAccount;
// TRANSFER FUNDS
const transfer = async (req, res, next) => {
    try {
        const { senderAccountNo, amount, receiverAccountNo, } = req.body;
        const content = {
            referenceId: uuid_1.v4(),
            senderAccountNo,
            amount,
            receiverAccountNo,
            createdAt: new Date().toISOString(),
        };
        // INPUT VALIDATIONS FOR FUNDS TO BE TRANSFERRED
        const accountNosList = models_1.balancesDB.map((item) => {
            return item.accountNo;
        });
        if (content.amount < 0) {
            res.status(400).json({ message: `PLEASE ENTER AN AMOUNT GREATER THAN ZERO!` });
        }
        else if ((typeof amount) == 'string') {
            res.status(400).json({ message: "FUND TRANSFER AMOUNT CANNOT BE STRING!" });
        }
        else if (models_1.balancesDB.every((item) => item.accountNo !== content.senderAccountNo)) {
            res.status(400).json({ message: `SENDER ACCOUNT NUMBER DOES NOT EXIST!` });
        }
        else if (senderAccountNo === receiverAccountNo) {
            res.status(400).json({ message: "SENDER ACCOUNT NUMBER AND RECEIVER ACCOUNT NUMBER CANNOT BE THE SAME!" });
        }
        else if (!accountNosList.includes(receiverAccountNo)) {
            res.status(400).json({ message: "RECEIVER ACCOUNT NUMBER DOES NOT EXIST!" });
        }
        else if (content.amount > models_1.balancesDB.find((item) => item.accountNo == content.senderAccountNo).balance) {
            res.status(400).json({ message: `INSUFFICIENT FUNDS!` });
        }
        else {
            const transactionData = await models_1.transferFunds(content);
            res.status(200).json(transactionData);
        }
    }
    catch (error) {
        next(error);
    }
};
exports.transfer = transfer;
//# sourceMappingURL=controllers.js.map