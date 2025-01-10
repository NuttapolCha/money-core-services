import { config } from "../shared";

export const USER_URL = `http://localhost:${config.services.user.port}`;
export const GEM_URL = `http://localhost:${config.services.gem.port}`;

export const postJson = async (
  endpoint: string,
  data: any,
  authorizedUserId?: string
): Promise<Response> => {
  const option: any = {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  };
  if (authorizedUserId) {
    option.headers = { ...option.headers, "user-id": authorizedUserId };
  }

  const res = await fetch(endpoint, option);
  return res;
};

export const get = async (
  endpoint: string,
  authorizedUserId?: string
): Promise<Response> => {
  const option: any = {
    method: "get",
  };
  if (authorizedUserId) {
    option.headers = { "user-id": authorizedUserId };
  }

  const res = await fetch(endpoint, option);
  return res;
};

export const getBalance = async (userId: string) => {
  const res = await get(`${GEM_URL}/balance`, userId);
  const json = await res.json();
  return json.data.balance;
};

export const transferGem = async (
  fromUserId: string,
  toUserId: string,
  amount: number
) => {
  const res = await postJson(
    `${GEM_URL}/transfer-gem`,
    {
      toUserId,
      amount,
    },
    fromUserId
  );
  return res;
};
