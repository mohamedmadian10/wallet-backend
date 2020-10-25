import { TransferController } from "./../controllers/transfer.controllers";
import { Router } from "express";
import { body } from "express-validator";
import { checkAuth } from "../middleware/jwt-config";

export class transferRoutes {
  router: Router;
  public transferController: TransferController = new TransferController();
  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.post(
      "/transfer",
      checkAuth,
      [body("from").isMobilePhone("ar-EG"), body("to").isMobilePhone("ar-EG")],
      this.transferController.transferBalance
    );
    this.router.get("/transfer", this.transferController.getTransferProcsesses);
  }
}
