import { NextFunction, Request, Response } from 'express';
import { getAllBal, getSingleBal, createNewAccount, transferFunds, balancesDB as balance} from './models'
import { nanoid } from 'nanoid';
import { v4 as uuid4 } from 'uuid';


// GET ALL BALANCES IN THE DATABASE
const getAllBalance = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const contents = await getAllBal(); 
    if (!contents) {
      res.status(404).json({ message: 'ACCOUNT INFORMATION NOT FOUND!' });
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
      res.status(404).json({ message: "ACCOUNT NUMBER DOES NOT EXIST!" });
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
        balance
      } = req.body;

      // VALIDATION FOR OPENING ACCOUNT BALANCE
      if ((typeof balance) == 'string') {
        res.status(400).json({ message: "ACCOUNT OPENING BALANCE CANNOT BE STRING!"})
      } else {
        const content = {
          accountNo: nanoid(),
          balance,
          createdAt: new Date().toISOString()
        }

        if (content.balance < 0) {
          res.status(400).json({ message: `ACCOUNT OPENING BALANCE MUST BE GREATER THAN ZERO!`});
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
      res.status(400).json({ message: `PLEASE ENTER AN AMOUNT GREATER THAN ZERO!`});
    } else if ((typeof amount) == 'string') {
      res.status(400).json({ message: "FUND TRANSFER AMOUNT CANNOT BE STRING!"})
    } else if (balance.every((item: any) => item.accountNo !== content.senderAccountNo)){
      res.status(400).json({ message: `SENDER ACCOUNT NUMBER DOES NOT EXIST!`});
    } else if (senderAccountNo === receiverAccountNo) {
      res.status(400).json({ message: "SENDER ACCOUNT NUMBER AND RECEIVER ACCOUNT NUMBER CANNOT BE THE SAME!"});
    } else if (!accountNosList.includes(receiverAccountNo)) {
      res.status(400).json({ message: "RECEIVER ACCOUNT NUMBER DOES NOT EXIST!"});
    } else if (content.amount > balance.find((item: any) => item.accountNo == content.senderAccountNo).balance) {
      res.status(400).json({ message: `INSUFFICIENT FUNDS!`});
    } else {
      const transactionData = await transferFunds(content);
      res.status(200).json(transactionData);
    }
  }catch(error) {
    next(error)
  }
}

// EXPORT ALL THE CONTROLLERS
export {
  getAllBalance,
  getSingleBalance,
  createAccount,
  transfer
}
