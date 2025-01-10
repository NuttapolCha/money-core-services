const GEM_ACCOUNTS_FIELDS_LIST = `
  id,
  user_id,
  balance,
  created_at,
  updated_at
`;

export const GET_GEMS_BY_USER_ID_QUERY = `
    SELECT
        ${GEM_ACCOUNTS_FIELDS_LIST}
    FROM gem_accounts
    WHERE user_id = $1
`;

export const SELECT_GEMS_FOR_UPDATE_QUERY = `
    SELECT
      ${GEM_ACCOUNTS_FIELDS_LIST}
    FROM gem_accounts
    WHERE user_id = $1 OR user_id = $2
    FOR UPDATE
`;

export type GetGemsQueryResult = {
  id: string;
  user_id: string;
  balance: number;
  created_at: Date;
  updated_at: Date;
};

export const UPDATE_GEM_ACCOUNT_QUERY = `
  UPDATE
    gem_accounts
  SET 
    user_id = $2,
    balance = $3,
    created_at = $4,
    updated_at = $5
  WHERE id = $1
`;
