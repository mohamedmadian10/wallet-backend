import express, {
  Application,
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import mongoose from "mongoose";
import cors from "cors";
import { userRoutes } from "./routes/userRouter";
import { transferRoutes } from "./routes/transferRoutes";

class Server {
  public app: Application;
  constructor() {
    this.app = express();
    this.config();
    this.mongo();
    this.routes();
  }

  public start() {
    this.app.listen(this.app.get("port"), () => {
      console.log("Listenning..");
    });
  }

  public config() {
    this.app.set("port", process.env.PORT || 8080);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());
  }

  private mongo() {
    mongoose
      .connect(
        // "mongodb://localhost:27017/walletDataBase"
        "mongodb+srv://momadian183:0180421332@cluster0.zc1o9.mongodb.net/wallet?retryWrites=true"
      )
      .then(() => console.log("DB Connected ..."))
      .catch((error) => console.log(error));
  }

  public routes() {
    this.app.use("/api/user", new userRoutes().router);
    this.app.use("/api/", new transferRoutes().router);
  }
}
const server = new Server();
server.start();
