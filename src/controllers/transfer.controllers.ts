import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { Transfer } from "../models/transferProcess.model";

export class TransferController {
  constructor() {}

  //transfer balance

  public transferBalance = (req: any, res: Response, next: NextFunction) => {
    this.validateInput(req);
    Transfer.transfer(req.body.from, req.body.to, req.body.balance)
      .then((result) => {
        // console.log(result);
        if (req.body.from != req.userData.mobile) {
          const error = new Error("Mobile Number is not correct");
          throw error;
        }
        res.status(200).json({
          message: `transfer Process done successfuly. `,
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "transfer process failed please try again",
          err: err,
        });
        console.log(err);
      });
  };

  // get all transfer Processes
  public getTransferProcsesses = (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    Transfer.find({})
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  private validateInput(req: Request) {
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
      const error = new Error("validation failed! please enter valid data");
      throw error;
    }
  }
}
