import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { IUser, User, transfer } from "../models/user";
import { validationResult } from "express-validator";

export class UserController {
  constructor() {}
  //register user
  public registerUser = (req: Request, res: Response, next: NextFunction) => {
    const name = req.body.name;
    const password = req.body.password;
    const mobile = req.body.mobile;
    //validate input
    this.validateInput(req);

    bcrypt.hash(password, 10).then((hashedPass) => {
      const newUser = new User({
        name: name,
        mobile: mobile,
        password: hashedPass,
        balance: 1000,
      });
      newUser
        .save()
        .then((result) => {
          res.status(201).json({
            message: "user created!!",
            result,
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    });
  };

  //login user
  public authenticateUser = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    this.validateInput(req);

    let currentUser: IUser;
    User.findOne({ mobile: req.body.mobile })
      .then((user): any => {
        if (!user) {
          return res.status(401).json({
            message: " Auth failed",
          });
        }
        currentUser = user;
        return bcrypt.compare(req.body.password, user.password);
      })
      .then((result) => {
        if (!result) {
          return res.status(401).json({
            message: " Auth failed",
          });
        }
        const token = jwt.sign(
          { mobile: currentUser.mobile, userId: currentUser._id },
          "secret_This_should_be_longer",
          { expiresIn: "1h" }
        );
        res.status(200).json({
          token: token,
          expiresIn: 3600,
        });
        return;
      })
      .catch((err) => {
        res.status(401).json({
          message: " Auth failed",
          err,
        });
        return err;
      });
  };

  //transfer balance

  public transferBalance = (req: any, res: Response, next: NextFunction) => {
    this.validateInput(req);
    transfer(req.body.from, req.body.to, req.body.balance)
      .then((result) => {
        if (req.body.from != req.userData.mobile) {
          const error = new Error("Mobile Number is not correct");
          throw error;
        }
        res.status(200).json({
          message: `transfer Process done successfuly. your currnt balance is `,
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

  private validateInput(req: Request) {
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
      const error = new Error("validation failed! please enter valid data");
      throw error;
    }
  }
}
