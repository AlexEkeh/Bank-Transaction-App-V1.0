import path from 'path';
import writeDataToFile from "./utility";
const balancesPath = path.join(__dirname, '..', 'balances.json');
const balancesDB = require(balancesPath);
const transactionsPath = path.join(__dirname, '..', 'transactions.json');
const transactionsDB = require(transactionsPath);



// GET ALL ACCOUNT INFORMATION FROM DATABASE
export function getAllBal() {
  return new Promise((resolve, _reject) => {
    resolve(balancesDB);
  });
}


// GET SINGLE ACCOUNT INFORMATION BY ITS ACCOUNT NUMBER FROM DATABASE
export function getSingleBal(accountNo: any){
  return new Promise((resolve, _reject) => {
    const accountBalInfo = balancesDB.find((item: any) => item.accountNo == accountNo);
    resolve(accountBalInfo);
  });
}

interface Create {
  accountNo: string,
  amount: number,
  createdAt: string
}

// CREATE NEW ACCOUNT INFORMATION
export function createNewAccount(content: Create): any {
    return new Promise((resolve, _reject) => {

      const newAccount = {
        accountNo: content.accountNo,
        balance: content.amount,
        createdAt: content.createdAt
      };

      balancesDB.push(newAccount);

      writeDataToFile(balancesPath, balancesDB);

      resolve(newAccount);
    })
}


// TRANSFER FUNDS
export function transferFunds(content: any): any {
  return new Promise((resolve, _reject) => {

      const newTransactionData = {
        senderAccountNo: content.senderAccountNo,
        amount: content.amount,
        receiverAccountNo: content.receiverAccountNo
      };

      const senderAccountIndex = balancesDB.findIndex((item: any) => item.accountNo == content.senderAccountNo);
      const receiverAccountIndex = balancesDB.findIndex((item: any) => item.accountNo == content.receiverAccountNo);


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


      writeDataToFile(balancesPath, balancesDB);


      const padSenderAccountNo = String(content.senderAccountNo).replace(/.{5}/, '*****');
      const newBal = balancesDB[senderAccountIndex].balance

      const updatedContent = {
        referenceId: content.referenceId,
        senderAccountNo: content.senderAccountNo,
        amount: content.amount,
        receiverAccountNo: content.receiverAccountNo,
        transferDescription: `Debit Transaction: N${content.amount} Transferred from ${padSenderAccountNo}. Bal: N${newBal}`,
        createdAt: content.createdAt,
      };

      transactionsDB.push(updatedContent);

      writeDataToFile(transactionsPath, transactionsDB);

      resolve(updatedContent);
  })
}


// Export The Balance Database To Be Needed By The Controller
export {
  balancesDB
}


