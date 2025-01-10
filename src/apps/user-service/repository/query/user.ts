export const CREATE_USER_QUERY = `
    INSERT INTO users
        (id, username, created_at, updated_at)
    VALUES
        ($1, $2, $3, $4)
`;

export const GET_USER_QUERY = `
    SELECT
        u.id,
        u.username,
        u.created_at,
        u.updated_at,
        g.id as gem_account_id,
        g.balance,
        g.created_at as gem_account_created_at,
        g.updated_at as gem_account_updated_at
    FROM users u
    LEFT JOIN gem_accounts g ON u.id = g.user_id
    WHERE u.id = $1
`;

export type GetUserQueryResult = {
  id: string;
  username: string;
  created_at: Date;
  updated_at: Date;
  account_id: string;
  balance: number;
  gem_account_created_at: Date;
  gem_account_updated_at: Date;
};
