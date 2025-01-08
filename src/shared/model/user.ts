import { v4 } from "uuid";
import { GemAccounts } from ".";

export type UserConstructorOpts = {
  id?: string;
  gems?: GemAccounts;
  createdAt?: Date;
  updatedAt?: Date;
};

export class User {
  id: string;
  username: string;
  gems: GemAccounts;
  createdAt: Date;
  updatedAt: Date;

  constructor(username: string, opts?: UserConstructorOpts) {
    this.id = opts?.id ? opts.id : v4();
    this.username = username;
    this.gems = opts?.gems ? opts.gems : new GemAccounts(this.id);
    this.createdAt = opts?.createdAt ? opts.createdAt : new Date();
    this.updatedAt = opts?.updatedAt ? opts.updatedAt : new Date();
  }

  public toSqlValue() {
    return [this.id, this.username, this.createdAt, this.updatedAt];
  }
}
