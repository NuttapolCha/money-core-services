export const GET_GEMS_BY_USER_ID_QUERY = `
    SELECT
        id,
        user_id,
        balance,
        created_at,
        updated_at
    FROM gem_accounts
    WHERE user_id = $1
`;

export type GetGemsQueryResult = {
  id: string;
  user_id: string;
  balance: number;
  created_at: Date;
  updated_at: Date;
};

export const UPDATE_GEMS = `
  UPDATE
    gem_accounts
  SET 
    balance = $1,
    updated_at = $2,
    created_at = $3
  WHERE id = $4
`;
