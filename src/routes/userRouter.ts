import { Router } from "express";
import { UserController } from "../controllers/userController";
import { checkAuth } from "../middleware/jwt-config";

export class userRoutes {
  router: Router;
  public userController: UserController = new UserController();
  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.post("/register", this.userController.registerUser);
    this.router.post("/login", this.userController.authenticateUser);
    this.router.post(
      "/transfer",
      checkAuth,
      this.userController.transferBalance
    );
  }
}
