import { NextFunction, Request, Response } from 'express';
import { getAllBal, getSingleBal, createNewAccount, transferFunds, balancesDB as balance} from './models'
import { v4 as uuid4 } from 'uuid';


// WELCOME PAGE
const homepage = async (_req: Request, res: Response, _next: NextFunction) => {
  return res.status(200).send("Welcome to Alexander's Bank Transaction Application V1.0. Please visit https://alexbankapp-v1.heroku.com/balance to view all account information and https://alexbankapp-v1.heroku.com/balance/accountNo to view individual account information. The accountNo supplied should not be in quote...Thank You!!! ");
 }


// GET ALL BALANCES IN THE DATABASE
const getAllBalance = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const contents = await getAllBal();
    if (!contents) {
      res.status(404).json({ message: 'Account Information Not Found!' });
    }
    res.status(200).json(contents);
  } catch(error) {
    next(error)
  }
}


// GET A BALANCE DETAILS BY UNIQUE ACCOUNT NUMBER
const getSingleBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let getAccountId = req.params.accountNo;
    const content = await getSingleBal(getAccountId);
    if (!content) {
      res.status(404).json({ message: "Account Number Does Not Exist!" });
    } else {
      res.status(200).json(content);
    }
  } catch(error) {
    next(error);
  }
}


// CREATE NEW ACCOUNT
const createAccount = async (req: Request, res: Response, next: NextFunction)  => {
    try{
      const {
        amount
      } = req.body;

      // VALIDATION FOR OPENING ACCOUNT BALANCE
      if ((typeof amount) == 'string' || !amount) {
        res.status(400).json({ message: "Please Enter A Valid Opening Amount!"})
      } else {
        const content = {
          accountNo: accountNoGenerator().toString(),
          amount,
          createdAt: new Date().toISOString()
        }

        if (content.amount < 0) {
          res.status(400).json({ message: `Account Opening Balance Must Be Greater Than Zero!`});
        } else {
          const newAccountInfo = await createNewAccount(content);
          res.status(201).json(newAccountInfo);
        }

      }
    } catch(error) {
      next(error);
    }

}

// TRANSFER FUNDS
const transfer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      senderAccountNo,
      amount,
      receiverAccountNo,
    } = req.body;

    if (!senderAccountNo || !amount || !receiverAccountNo) {
      return res.status(400).json({ message: "Please Provide All Fields"})
    }

    const content = {
      referenceId: uuid4(),
      senderAccountNo,
      amount,
      receiverAccountNo,
      createdAt: new Date().toISOString(),
    };


    // INPUT VALIDATIONS FOR FUNDS TO BE TRANSFERRED
    const accountNosList = balance.map((item: any) => {
      return item.accountNo
    })

    if (content.amount < 0 ) {
      res.status(400).json({ message: `Please Enter An Amount Greater Than Zero!`});
    } else if ((typeof amount) == 'string') {
      res.status(400).json({ message: "Fund Transfer Amount Cannot Be String!"})
    } else if (balance.every((item: any) => item.accountNo !== content.senderAccountNo)){
      res.status(400).json({ message: `Sender Account Number Does Not Exist!`});
    } else if (senderAccountNo === receiverAccountNo) {
      res.status(400).json({ message: "Sender Account Number And Receiver Account Number Cannot Be The Same!"});
    } else if (!accountNosList.includes(receiverAccountNo)) {
      res.status(400).json({ message: "Receiver Account Number Does Not Exist!"});
    } else if (content.amount > balance.find((item: any) => item.accountNo == content.senderAccountNo).balance) {
      res.status(400).json({ message: `Insufficient Funds!`});
    } else {
      const transactionData = await transferFunds(content);
      res.status(200).json(transactionData);
    }
  }catch(error) {
    next(error)
  }
}


// 10-DIGIT ACCOUNT NUMBER GENERATOR FUNCTION
function accountNoGenerator() {
  const result = Math.floor(Math.random() * 9000000000) + 1000000000;
  return result;
}


// EXPORT ALL THE CONTROLLERS
export {
  homepage,
  getAllBalance,
  getSingleBalance,
  createAccount,
  transfer
}
