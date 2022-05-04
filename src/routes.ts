import { homepage, getAllBalance, getSingleBalance, createAccount, transfer } from './controllers';
import express from 'express';
const router = express.Router();


// WELCOME PAGE
router.get('/', homepage);

// GET ALL ACCOUNTS AND THEIR BALANCE
router.get('/balance', getAllBalance);

// GET BALANCE FOR A PARTICULAR ACCOUNT NUMBER
router.get('/balance/:accountNo', getSingleBalance);

// ENABLE A USER TO CREATE AN ACCOUNT
router.post('/create-account', createAccount);

// MAKE A TRANSFER TRANSACTION TO ANOTHER ACCOUNT
router.post('/transfer', transfer);



export default router;
