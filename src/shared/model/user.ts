import { v4 } from "uuid";
import { GemAccount } from "./gemAccount";

export type UserConstructorOpts = {
  id?: string;
  gemAccount?: GemAccount | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export class User {
  id: string;
  username: string;
  gemAccount: GemAccount | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(username: string, opts?: UserConstructorOpts) {
    this.id = opts?.id ? opts.id : v4();
    this.username = username;
    this.gemAccount =
      opts?.gemAccount || opts?.gemAccount === null
        ? opts.gemAccount
        : new GemAccount(this.id);
    this.createdAt = opts?.createdAt ? opts.createdAt : new Date();
    this.updatedAt = opts?.updatedAt ? opts.updatedAt : new Date();
  }

  public toSqlValue() {
    return [this.id, this.username, this.createdAt, this.updatedAt];
  }

  public toResponse() {
    return {
      userId: this.id,
      username: this.username,
    };
  }
}
