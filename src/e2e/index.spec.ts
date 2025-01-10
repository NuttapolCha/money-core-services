import { describe, expect, it } from "vitest";
import {
  GEM_URL,
  get,
  getBalance,
  postJson,
  transferGem,
  USER_URL,
} from "./helper";

let aliceUserId = "";
let aliceBalance = 0;
let bobUserId = "";
let bobBalance = 0;

describe("User Service", () => {
  it("should verify healthy status of the service", async () => {
    const res = await fetch(`${USER_URL}/healthz`);
    expect(res.status).toBe(200);
  });

  it("should create Alice user", async () => {
    const res = await postJson(`${USER_URL}/users`, { username: "Alice" });
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json).toEqual({
      message: expect.any(String),
      data: {
        userId: expect.any(String),
        username: "Alice",
      },
    });
    aliceUserId = json.data.userId;
  });

  it("should create Bob user", async () => {
    const res = await postJson(`${USER_URL}/users`, { username: "Bob" });
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json).toEqual({
      message: expect.any(String),
      data: {
        userId: expect.any(String),
        username: "Bob",
      },
    });
    bobUserId = json.data.userId;
  });

  it("should not create user when username is already exist", async () => {
    const res = await postJson(`${USER_URL}/users`, { username: "Alice" });
    expect(res.status).toBe(500);
  });

  it("should view Alice's profile", async () => {
    const res = await get(`${USER_URL}/me`, aliceUserId);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({
      message: expect.any(String),
      data: {
        userId: aliceUserId,
        username: "Alice",
      },
    });
  });

  it("should not see the profile when unauthoized", async () => {
    const res = await get(`${USER_URL}/me`);

    expect(res.status).toBe(401);
  });
});

describe("Gem Service", () => {
  it("should view GEM account balance when authoized as Alice", async () => {
    const res = await get(`${GEM_URL}/balance`, aliceUserId);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({
      message: expect.any(String),
      data: {
        gemAccountId: expect.any(String),
        balance: expect.any(Number),
      },
    });
    aliceBalance = json.data.balance;
  });

  it("should view GEM account balance when authoized as Bob", async () => {
    const res = await get(`${GEM_URL}/balance`, bobUserId);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({
      message: expect.any(String),
      data: {
        gemAccountId: expect.any(String),
        balance: expect.any(Number),
      },
    });
    bobBalance = json.data.balance;
  });

  describe("should transfer 100 GEM to Bob's account when authorized as Alice", () => {
    it("should transfer success", async () => {
      const res = await transferGem(aliceUserId, bobUserId, 100);
      expect(res.status).toBe(200);
    });

    it("should debit and credit the balance correctly", async () => {
      const aliceNewBalance = await getBalance(aliceUserId);
      const bobNewBalance = await getBalance(bobUserId);

      expect(aliceNewBalance).toBe(aliceBalance - 100);
      expect(bobNewBalance).toBe(bobBalance + 100);

      aliceBalance = aliceNewBalance;
      bobBalance = bobNewBalance;
    });
  });

  it("should not transfer GEM if the amount is negative", async () => {
    const res = await transferGem(aliceUserId, bobUserId, -1000);
    expect(res.status).toBe(422);
  });

  it("should not transfer GEM if the balance is insufficient", async () => {
    const res = await transferGem(aliceUserId, bobUserId, 9999);
    expect(res.status).toBe(500);
  });

  describe("should save transactions as double-entry book keeping", () => {
    it("should see Alice's debit transaction", async () => {
      const res = await get(
        `${GEM_URL}/transactions?limit=10&page=1`,
        aliceUserId
      );
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json).toEqual({
        message: expect.any(String),
        data: expect.any(Array),
        pagination: {
          total: expect.any(Number),
          page: expect.any(Number),
          pageCount: expect.any(Number),
          limit: expect.any(Number),
        },
      });
      expect(json.data[0].amount).toBe(-100);
    });

    it("should see Bob's credit transaction", async () => {
      const res = await get(
        `${GEM_URL}/transactions?limit=10&page=1`,
        bobUserId
      );
      const json = await res.json();
      expect(json.data[0].amount).toBe(100);
    });
  });
});
