import { Router } from "express";
import { UserController } from "../controllers/userController";
import { body } from "express-validator";
import { checkAuth } from "../middleware/jwt-config";

export class userRoutes {
  router: Router;
  public userController: UserController = new UserController();
  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.post(
      "/register",
      [body("mobile").isMobilePhone("ar-EG")],
      this.userController.registerUser
    );
    this.router.post(
      "/login",
      [body("mobile").isMobilePhone("ar-EG")],
      this.userController.authenticateUser
    );
  }
}
