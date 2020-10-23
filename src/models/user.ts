import {
  Document,
  Schema,
  Model,
  model,
  Error,
  Mongoose,
  startSession,
  plugin,
} from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
export interface IUser extends Document {
  name: string;
  mobile: Number;
  password: string;
  balance: Number;
}
export const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  mobile: { type: Number, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number },
});
plugin(uniqueValidator);

export async function transfer(from: Number, to: Number, amount: Number) {
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
    if (A !== null && A.balance < 0 || B ===null ) {
      // If A would have negative balance, fail and abort the transaction
      // `session.abortTransaction()` will undo the above `findOneAndUpdate()`
      throw new Error("Insufficient funds" );
    }
    await session.commitTransaction();
    session.endSession();
    return { from: A, to: B };
  } catch (error) {
    // If an error occurred, abort the whole transaction and
    // undo any changes that might have happened
    await session.abortTransaction();
    session.endSession();
    throw error; // Rethrow so calling function sees error
  }
}

export const User: Model<IUser> = model<IUser>("User", userSchema);
