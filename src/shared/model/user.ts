import { v4 } from "uuid";

export type UserConstructorOpts = {
  id?: string;
  gems?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export class User {
  id: string;
  name: string;
  gems: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(name: string, opts?: UserConstructorOpts) {
    this.id = opts?.id ? opts.id : v4();
    this.name = name;
    this.gems = opts?.gems ? opts.gems : 0;
    this.createdAt = opts?.createdAt ? opts.createdAt : new Date();
    this.updatedAt = opts?.updatedAt ? opts.updatedAt : new Date();
  }

  public toSqlValue() {
    return [this.id, this.name, this.gems, this.createdAt, this.updatedAt];
  }
}
