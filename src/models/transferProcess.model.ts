import { User } from "./user";
import {
  Document,
  Schema,
  Model,
  model,
  Error,
  startSession,
  plugin,
} from "mongoose";
export interface ITransfer extends Document {
  from: Number;
  to: Number;
  balance: Number;
}
interface IMTransfer extends Model<ITransfer> {
  transfer(from: any, to: any, balance: any):Promise<ITransfer>

}
export const transferSchema: Schema = new Schema(
  {
    from: { type: Number, required: true },
    to: { type: Number, required: true},
    balance: { type: Number },
  },
  { timestamps: true }
);

//transfer 
transferSchema.statics.transfer = async function (from: Number, to: Number, amount: Number) {
  const session = await startSession();
  session.startTransaction();
  try {
    const opts = { session, new: true, useFindAndModify: false };
    const A = await User.findOneAndUpdate(
      { mobile: from },
      { $inc: { balance: -amount } },
      opts
    );
    const B = await User.findOneAndUpdate(
      { mobile: to },
      { $inc: { balance: amount } },
      opts
    );
    if ((A !== null && A.balance < 0) || B === null) {
      // If A would have negative balance, fail and abort the transaction
      // `session.abortTransaction()` will undo the above `findOneAndUpdate()`
      throw new Error("Insufficient funds");
    }
    await session.commitTransaction();
    session.endSession();
    const transferProcess = new Transfer({ from: A?.mobile, to: B.mobile, balance:amount}) ;
    return transferProcess.save()
  } catch (error) {
    // If an error occurred, abort the whole transaction and
    // undo any changes that might have happened
    await session.abortTransaction();
    session.endSession();
    throw error; // Rethrow so calling function sees error
  }
}

export const Transfer: IMTransfer = model<ITransfer, IMTransfer>(
  "Transfer",
  transferSchema
);
