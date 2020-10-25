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


export const User: Model<IUser> = model<IUser>("User", userSchema);
