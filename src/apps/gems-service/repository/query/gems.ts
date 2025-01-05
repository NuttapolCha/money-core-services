export const GET_GEMS_BY_USER_ID_QUERY = `
    SELECT
        id,
        user_id,
        balance,
        created_at,
        updated_at
    FROM gems
    WHERE user_id = $1
`;

export type GetGemsQueryResult = {
  id: string;
  user_id: string;
  balance: number;
  created_at: Date;
  updated_at: Date;
};
