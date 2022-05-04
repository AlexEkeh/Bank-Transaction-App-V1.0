"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transfer = exports.createAccount = exports.getSingleBalance = exports.getAllBalance = exports.homepage = void 0;
const models_1 = require("./models");
const uuid_1 = require("uuid");
// WELCOME PAGE
const homepage = async (_req, res, _next) => {
    return res.status(200).send("Welcome to Alexander's Bank Transaction Application V1.0. Please visit https://alexbankapp.heroku.com/balance to view all account information and https://alexbankapp.heroku.com/balance/accountNo to view individual account information. The accountNo supplied should not be in quote...Thank You!!! ");
};
exports.homepage = homepage;
// GET ALL BALANCES IN THE DATABASE
const getAllBalance = async (_req, res, next) => {
    try {
        const contents = await models_1.getAllBal();
        if (!contents) {
            res.status(404).json({ message: 'Account Information Not Found!' });
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
            res.status(404).json({ message: "Account Number Does Not Exist!" });
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
        const { amount } = req.body;
        // VALIDATION FOR OPENING ACCOUNT BALANCE
        if ((typeof amount) == 'string' || !amount) {
            res.status(400).json({ message: "Please Enter A Valid Opening Amount!" });
        }
        else {
            const content = {
                accountNo: accountNoGenerator().toString(),
                amount,
                createdAt: new Date().toISOString()
            };
            if (content.amount < 0) {
                res.status(400).json({ message: `Account Opening Balance Must Be Greater Than Zero!` });
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
        if (!senderAccountNo || !amount || !receiverAccountNo) {
            return res.status(400).json({ message: "Please Provide All Fields" });
        }
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
            res.status(400).json({ message: `Please Enter An Amount Greater Than Zero!` });
        }
        else if ((typeof amount) == 'string') {
            res.status(400).json({ message: "Fund Transfer Amount Cannot Be String!" });
        }
        else if (models_1.balancesDB.every((item) => item.accountNo !== content.senderAccountNo)) {
            res.status(400).json({ message: `Sender Account Number Does Not Exist!` });
        }
        else if (senderAccountNo === receiverAccountNo) {
            res.status(400).json({ message: "Sender Account Number And Receiver Account Number Cannot Be The Same!" });
        }
        else if (!accountNosList.includes(receiverAccountNo)) {
            res.status(400).json({ message: "Receiver Account Number Does Not Exist!" });
        }
        else if (content.amount > models_1.balancesDB.find((item) => item.accountNo == content.senderAccountNo).balance) {
            res.status(400).json({ message: `Insufficient Funds!` });
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
// 10-DIGIT ACCOUNT NUMBER GENERATOR FUNCTION
function accountNoGenerator() {
    const result = Math.floor(Math.random() * 9000000000) + 1000000000;
    return result;
}
//# sourceMappingURL=controllers.js.map