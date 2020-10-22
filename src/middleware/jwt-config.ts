import * as jwt from "jsonwebtoken";
import { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import { IUser } from "../models/user";

export const checkAuth = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error: Error = new Error("Not Authenticated.");
    // error.status = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1]; // Bearer token
  let decodedToken: any;
  try {
    decodedToken = jwt.verify(token, "secret_This_should_be_longer");
  } catch (err) {
    const error = new Error("Not Authenticated.");
    // error.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Not Authenticated.");
    // error.statusCode = 401;
    throw error;
  }
  req.userData = {
    mobile: decodedToken.mobile,
    userId: decodedToken._id,
  };
  next();
};
